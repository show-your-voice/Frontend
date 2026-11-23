import { useCallback, useEffect, useId, useState } from 'react'
import styled from 'styled-components'
import { request } from '../../api/client.js'
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
    }).catch(() => {
      if (!ignore) setPlacesError('장소 목록을 불러오지 못했습니다.')
    })
    return () => { ignore = true }
  }, [placesAttempt])

  useEffect(() => {
    if (selectedId == null) return
    let ignore = false
    request(`/api/places/${selectedId}/floor-plan`).then((data) => {
      if (!ignore) setFloorResult({ placeId: selectedId, data })
    }).catch(() => {
      if (!ignore) setFloorResult({ placeId: selectedId, error: '평면도를 불러오지 못했습니다.' })
    })
    return () => { ignore = true }
  }, [selectedId, floorAttempt])

  async function saveName(event) {
    event.preventDefault()
    const name = editor.name.trim()
    if (!name || saving) return
    setSaving(true)
    try {
      const updated = await request(`/api/rooms/${editor.id}`, { method: 'PATCH', body: { name } })
      setFloorResult((result) => ({
        ...result,
        data: { ...result.data, rooms: result.data.rooms.map((room) => room.id === editor.id ? { ...room, name: updated.name } : room) },
      }))
      setEditor(null)
    } catch {
      setEditor({ ...editor, error: '이름을 저장하지 못했습니다. 다시 시도해 주세요.' })
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
              aria-label="실 이름" rows={1} maxLength={50} required value={editor.name} readOnly={saving}
              onChange={(event) => setEditor({ ...editor, name: event.target.value, error: '' })}
            />
          </Editor>
        )}
      />
    </Page>
  )
}
