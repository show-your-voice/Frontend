import { useCallback, useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import { ApiError, request } from '../../api/client.js'
import Button from '../../components/Button.jsx'
import FloorPlan from './FloorPlan.jsx'
import { splitPlacesByDisplayType } from './schoolMapPreviewData.js'

const Page = styled.main`
  display: grid;
  min-height: calc(100dvh - 64px);
  padding: 18px 20px 20px;
  background: ${({ theme }) => theme.schoolMap.color.background};
  color: ${({ theme }) => theme.schoolMap.color.text};
  font-family: ${({ theme }) => theme.schoolMap.font.family};
`

const MapActions = styled.div`
  position: absolute;
  z-index: 2;
  inset-block-start: 12px;
  inset-inline-end: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`

const Editor = styled.form`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;

  textarea {
    field-sizing: content;
    width: 100%;
    min-width: 0;
    max-height: 100%;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: inherit;
    caret-color: ${({ theme }) => theme.schoolMap.color.accent};
    font: inherit;
    font-size: calc(var(--cell-size) * ${({ $length }) => Math.min(0.23, 0.7 / Math.ceil(Math.sqrt(Math.max(1, $length))))});
    text-align: center;
    overflow-wrap: anywhere;
    overflow: hidden;
    resize: none;
  }

`

const noReports = new Map()
const roomNameMaxLength = 50

function getMapError(error, fallback) {
  if (error instanceof ApiError) {
    if (error.status === 401) return '로그인이 만료됐습니다. 다시 로그인해 주세요.'
    if (error.status === 403) return '지도 관리 권한이 없습니다.'
  }
  return fallback
}

export default function MapManagementPage() {
  const editorFormId = useId()
  const [places, setPlaces] = useState(null)
  const [placesError, setPlacesError] = useState('')
  const [placesAttempt, setPlacesAttempt] = useState(0)
  const [placeId, setPlaceId] = useState(null)
  const [floorResult, setFloorResult] = useState(null)
  const [floorAttempt, setFloorAttempt] = useState(0)
  const [editor, setEditor] = useState(null)
  const [saving, setSaving] = useState(false)
  const { floorPlaces, quickPlaces } = splitPlacesByDisplayType(places ?? [])
  const selected = places?.find((place) => place.id === placeId) ??
    floorPlaces.find((place) => place.name === '창의관 4층') ?? floorPlaces[0] ?? quickPlaces[0]
  const selectedId = selected?.id
  const editing = editor !== null
  const focusRoomName = useCallback((field) => {
    if (!field) return
    field.focus()
    const end = field.value.length
    field.setSelectionRange(end, end)
  }, [])

  useEffect(() => {
    if (!editing || saving) return

    function cancelOnOutsideClick(event) {
      if (event.target instanceof Element && event.target.closest('[data-area-id], [data-map-edit-actions]')) return
      setEditor(null)
    }

    document.addEventListener('click', cancelOnOutsideClick, true)
    return () => document.removeEventListener('click', cancelOnOutsideClick, true)
  }, [editing, saving])

  useEffect(() => {
    let ignore = false
    request('/api/places').then((data) => {
      if (!Array.isArray(data)) throw new Error('Invalid places response')
      if (!ignore) setPlaces(data)
    }).catch((error) => {
      if (!ignore) setPlacesError(getMapError(error, '장소 목록을 불러오지 못했습니다.'))
    })
    return () => { ignore = true }
  }, [placesAttempt])

  useEffect(() => {
    if (selectedId == null) return
    let ignore = false
    request(`/api/places/${selectedId}/floor-plan`).then((data) => {
      if (!ignore) setFloorResult({ placeId: selectedId, data })
    }).catch((error) => {
      if (!ignore) setFloorResult({ placeId: selectedId, error: getMapError(error, '평면도를 불러오지 못했습니다.') })
    })
    return () => { ignore = true }
  }, [selectedId, floorAttempt])

  async function saveName(event) {
    event.preventDefault()
    const name = editor.name.trim()
    if (!name || name.length > roomNameMaxLength || saving) return
    setSaving(true)
    try {
      const updated = await request(`/api/rooms/${editor.id}`, { method: 'PATCH', body: { name } })
      if (updated?.id !== editor.id || typeof updated.name !== 'string' || !updated.name.trim()) {
        throw new Error('Invalid room update response')
      }
      setFloorResult((result) => ({
        ...result,
        data: { ...result.data, rooms: result.data.rooms.map((room) => room.id === editor.id ? { ...room, name: updated.name } : room) },
      }))
      setEditor(null)
    } catch (error) {
      const nameError = error instanceof ApiError && error.fieldErrors.find(({ field }) => field === 'name')?.reason
      const fallback = error instanceof ApiError && error.status === 404
        ? '실을 찾을 수 없습니다. 페이지를 새로고침해 주세요.'
        : '이름을 저장하지 못했습니다. 다시 시도해 주세요.'
      setEditor({ ...editor, error: nameError || getMapError(error, fallback) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Page>
      <FloorPlan
        management
        floorPlaces={floorPlaces} quickPlaces={quickPlaces} selectedPlaceId={selectedId}
        placesLoading={!places && !placesError} placesError={placesError}
        floorResult={floorResult?.placeId === selectedId ? floorResult : null}
        onRetryPlaces={() => { setPlacesError(''); setPlacesAttempt((attempt) => attempt + 1) }}
        onRetryFloor={() => { setFloorResult(null); setFloorAttempt((attempt) => attempt + 1) }}
        onPlaceChange={(id) => {
          if (saving || id === selectedId) return
          setEditor(null)
          setFloorResult(null)
          setPlaceId(id)
        }}
        roomCounts={noReports} selectedRoom={editor?.id}
        onRoomSelect={(id, name) => { if (!saving) setEditor({ id, name }) }}
        mapActions={editor && (
          <MapActions data-map-edit-actions>
            {editor.error && <span role="alert">{editor.error}</span>}
            <Button size="small" variant="neutral" disabled={saving} onClick={() => setEditor(null)}>취소</Button>
            <Button size="small" type="submit" form={editorFormId} fullWidth={false} disabled={saving || !editor.name.trim()}>완료</Button>
          </MapActions>
        )}
        renderRoomEditor={() => editor && (
          <Editor id={editorFormId} $length={editor.name.length} onSubmit={saveName} onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return
            if (event.key === 'Escape' && !saving) setEditor(null)
            if (event.key === 'Enter' && event.target instanceof HTMLTextAreaElement) {
              event.preventDefault()
              event.currentTarget.requestSubmit()
            }
          }}>
            <textarea
              ref={focusRoomName}
              aria-label="실 이름" rows={1} maxLength={roomNameMaxLength} required value={editor.name} readOnly={saving}
              onChange={(event) => setEditor({ ...editor, name: event.target.value, error: '' })}
            />
          </Editor>
        )}
      />
    </Page>
  )
}
