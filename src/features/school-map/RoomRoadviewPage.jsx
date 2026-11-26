import { useEffect, useRef, useState } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
import styled from 'styled-components'
import { ApiError, apiUrl, request } from '../../api/client.js'
import cameraIcon from '../../assets/school-map/roadview-camera.svg'
import pinIcon from '../../assets/school-map/roadview-pin.svg'
import Button from '../../components/Button.jsx'

const Page = styled.section`
  display: flex;
  min-height: 0;
  height: calc(100dvh - 64px);
  flex: 1;
  padding: 16px 20px 20px;
  background: ${({ theme }) => theme.schoolMap.color.background};
  font-family: ${({ theme }) => theme.schoolMap.font.family};
  color: ${({ theme }) => theme.schoolMap.color.text};
`

const ViewerPanel = styled.section`
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  border-radius: 28px;
  background: ${({ theme }) => theme.schoolMap.color.surface};

  .psv-container { position: absolute; inset: 0; }
`

const ViewerMount = styled.div`
  position: absolute;
  inset: 0;
  touch-action: none;
  user-select: none;

  .psv-container { cursor: grab; }
  .psv-container:active { cursor: grabbing; }
`

const ExitButton = styled(Button)`
  position: absolute;
  z-index: 2;
  top: 20px;
  right: 24px;
  width: 32px;
  height: 32px;
  padding: 0;
  background: ${({ theme }) => theme.schoolMap.color.surface};
  font-size: 18px;

  @media (max-width: 600px) { right: 14px; }
`

const EmptyState = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: ${({ theme }) => theme.schoolMap.color.secondaryText};
  text-align: center;
  pointer-events: none;

  img { width: 48px; height: 48px; }
  p { margin: 0; font-size: 14px; line-height: 1.4; }
`

const ReportBar = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 24px;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: calc(100% - 48px);
  padding: 12px 12px 12px 24px;
  border: 1px solid ${({ theme }) => theme.schoolMap.color.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.schoolMap.color.surface};
  transform: translateX(-50%);

  @media (max-width: 600px) {
    right: 12px;
    bottom: 12px;
    left: 12px;
    max-width: none;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 12px;
    transform: none;
  }
`

const ReportInfo = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 12px;

  img { width: 24px; height: 24px; flex: 0 0 auto; }
  p { margin: 0; }
  p + p { margin-top: 2px; color: ${({ theme }) => theme.schoolMap.color.secondaryText}; font-size: 13px; }

  @media (max-width: 600px) {
    gap: 8px;
    font-size: 13px;
    img { width: 20px; height: 20px; }
    p + p { font-size: 11px; }
  }
`

const ReportButton = styled(Button)`
  min-width: 120px;
  min-height: 40px;
  padding: 0 18px;
  font-size: 14px;

  @media (max-width: 600px) {
    min-width: 0;
    padding-inline: 12px;
    font-size: 12px;
  }
`

function resolveImageUrl(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.trim()) return ''
  const value = imageUrl.trim()
  if (/^https?:\/\//i.test(value)) return value
  return apiUrl(value.startsWith('/') ? value : `/${value}`)
}

function queueRotation(pending, viewerRef, deltaYaw, deltaPitch) {
  pending.yaw += deltaYaw
  pending.pitch += deltaPitch
  if (pending.frame !== null) return

  pending.frame = requestAnimationFrame(() => {
    const { yaw: queuedYaw, pitch: queuedPitch } = pending
    pending.frame = null
    pending.yaw = 0
    pending.pitch = 0

    const viewer = viewerRef.current
    if (!viewer || (!queuedYaw && !queuedPitch)) return
    const { yaw, pitch } = viewer.getPosition()
    viewer.rotate({ yaw: yaw + queuedYaw, pitch: pitch + queuedPitch })
  })
}

export default function RoomRoadviewPage({ room, roomId, onExit, onReport }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const dragRef = useRef(null)
  const pendingRotationRef = useRef({ frame: null, yaw: 0, pitch: 0 })
  const [result, setResult] = useState(null)
  const [imageState, setImageState] = useState('loading')
  const panoramaUrl = resolveImageUrl(result?.data?.imageUrl)
  const roomName = result?.data?.roomName ?? room.name
  const loadState = roomId == null ? 'missing' : !result ? 'loading' :
    result.error ? 'requestFailed' : panoramaUrl ? imageState : 'missing'

  useEffect(() => {
    if (roomId == null) return
    let active = true
    request(`/api/rooms/${roomId}/roadview`).then((data) => {
      if (data?.roomId !== roomId || typeof data.roomName !== 'string' ||
        (data.imageUrl !== null && typeof data.imageUrl !== 'string')) {
        throw new Error('Invalid room roadview response')
      }
      if (active) setResult({ data })
    }).catch((error) => {
      if (!active) return
      let message = '로드뷰 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
      if (error instanceof ApiError && error.status === 401) message = '로그인이 만료됐습니다. 다시 로그인해 주세요.'
      if (error instanceof ApiError && error.status === 404) message = '선택한 실을 찾을 수 없습니다.'
      setResult({ error: message })
    })
    return () => { active = false }
  }, [roomId])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !panoramaUrl) return undefined

    const pending = pendingRotationRef.current
    let active = true
    let ready = false
    let viewer
    const markFailed = () => { if (active) setImageState('failed') }

    function panWithWheel(event) {
      if (!ready || event.ctrlKey || (!event.deltaX && !event.deltaY)) return
      event.preventDefault()
      event.stopPropagation()
      const width = Math.max(1, container.clientWidth)
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width : 1
      const sensitivity = Math.PI * unit / width
      queueRotation(pending, viewerRef, event.deltaX * sensitivity, -event.deltaY * sensitivity)
    }

    try {
      viewer = new Viewer({
        container,
        navbar: false,
        mousemove: true,
        moveSpeed: 1.35,
        moveInertia: false,
        touchmoveTwoFingers: false,
        withCredentials: (url) => new URL(url, window.location.href).origin === new URL(apiUrl('/'), window.location.href).origin,
        lang: {
          loading: '로드뷰 이미지를 불러오는 중입니다.',
          loadError: '로드뷰 이미지를 불러오지 못했습니다.',
          webglError: '이 브라우저에서는 360도 로드뷰를 표시할 수 없습니다.',
          twoFingers: '두 손가락으로 화면을 움직여 주세요.',
        },
      })
      viewerRef.current = viewer
      container.addEventListener('wheel', panWithWheel, { capture: true, passive: false })
      viewer.setPanorama(panoramaUrl).then((loaded) => {
        ready = loaded
        if (active) setImageState(loaded ? 'loaded' : 'failed')
      }).catch(markFailed)
    } catch {
      markFailed()
    }

    return () => {
      active = false
      container.removeEventListener('wheel', panWithWheel, true)
      if (pending.frame !== null) cancelAnimationFrame(pending.frame)
      pending.frame = null
      pending.yaw = 0
      pending.pitch = 0
      dragRef.current = null
      viewerRef.current = null
      viewer?.destroy()
    }
  }, [panoramaUrl])

  function startDrag(event) {
    if (loadState !== 'loaded' || event.pointerType === 'touch' || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      sensitivity: Math.PI / Math.max(1, event.currentTarget.clientWidth),
    }
  }

  function moveDrag(event) {
    const drag = dragRef.current
    if (drag?.id !== event.pointerId) return
    queueRotation(
      pendingRotationRef.current,
      viewerRef,
      (drag.x - event.clientX) * drag.sensitivity,
      (event.clientY - drag.y) * drag.sensitivity,
    )
    drag.x = event.clientX
    drag.y = event.clientY
  }

  function endDrag(event) {
    if (dragRef.current?.id === event.pointerId) dragRef.current = null
  }

  const stateMessage = {
    loading: '로드뷰 이미지를 불러오는 중입니다.',
    missing: '이 실에는 등록된 로드뷰 이미지가 없습니다.',
    requestFailed: result?.error,
    failed: '로드뷰 이미지를 표시하지 못했습니다. 잠시 후 다시 시도해 주세요.',
  }[loadState]

  return (
    <Page aria-label={`${roomName} 로드뷰`}>
      <ViewerPanel>
        {panoramaUrl && (
          <ViewerMount
            ref={containerRef}
            aria-label={`${roomName} 360도 로드뷰`}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onLostPointerCapture={endDrag}
          />
        )}
        <ExitButton size="small" variant="neutral" aria-label="로드뷰 나가기" onClick={onExit}>×</ExitButton>
        {stateMessage && (
          <EmptyState role={loadState === 'failed' || loadState === 'requestFailed' ? 'alert' : 'status'}>
            <img src={cameraIcon} alt="" />
            <p>{stateMessage}</p>
          </EmptyState>
        )}
        <ReportBar>
          <ReportInfo>
            <img src={pinIcon} alt="" />
            <div>
              <p>불편한 점이 있나요?</p>
              <p>이 장소의 문제를 신고할 수 있어요.</p>
            </div>
          </ReportInfo>
          <ReportButton fullWidth={false} onClick={onReport}>불편 신고하기</ReportButton>
        </ReportBar>
      </ViewerPanel>
    </Page>
  )
}
