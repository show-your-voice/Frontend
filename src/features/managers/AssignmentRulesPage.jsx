import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { request } from '../../api/client.js'
import Button from '../../components/Button.jsx'
import Modal from '../../components/Modal.jsx'
import PageIntro from '../../components/PageIntro.jsx'
import { fetchManagers, fetchRooms } from '../reports/reportApi.js'
import { REPORT_CATEGORY_CODES } from '../reports/reportFormValidation.js'

const rulesPath = '/api/assignment-rules'
const categories = Object.entries(REPORT_CATEGORY_CODES)
const categoryLabels = Object.fromEntries(categories.map(([label, code]) => [code, label]))

const Page = styled.main`
  min-height: calc(100dvh - 64px);
  padding: ${({ theme }) => theme.space[16]} ${({ theme }) => theme.manager.layout.pageInset};
  background: ${({ theme }) => theme.manager.color.background};
  color: ${({ theme }) => theme.manager.color.body};
  font-family: ${({ theme }) => theme.report.font.family};

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[4]};
  }
`

const Content = styled.div`
  max-width: ${({ theme }) => theme.manager.layout.maxWidth};
  margin-inline: auto;
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
`

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
`

const Surface = styled.section`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.manager.color.surface};

  > p { padding: ${({ theme }) => theme.space[6]}; margin: 0; }
  ul { list-style: none; margin: 0; padding: 0; }
  li {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto;
    align-items: center;
    gap: ${({ theme }) => theme.space[3]};
    padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
    overflow-wrap: anywhere;
  }
  li + li { border-top: 1px solid ${({ theme }) => theme.manager.color.border}; }
  small { display: block; color: ${({ theme }) => theme.manager.color.muted}; }
  strong { font-weight: 600; }
  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    li { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    li > :first-child { grid-column: 1 / -1; }
    li > :last-child { grid-column: 1 / -1; }
  }
`

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space[2]};

  button { min-height: 44px; }
`

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[5]};

  label { display: grid; gap: ${({ theme }) => theme.space[1]}; }
  select {
    width: 100%;
    min-width: 0;
    min-height: ${({ theme }) => theme.auth.layout.fieldHeight};
    padding-inline: ${({ theme }) => theme.space[3]};
    border: 1px solid ${({ theme }) => theme.manager.color.muted};
    border-radius: ${({ theme }) => theme.radius.md};
    color: inherit;
    background: ${({ theme }) => theme.manager.color.surface};
    font: inherit;
  }
  select:focus-visible { outline: 2px solid ${({ theme }) => theme.report.color.focus}; }
  p { margin: 0; }
`

function RuleDialog({ mode, rule, rooms, managers, onClose, onSaved }) {
  const creating = mode === 'create'
  const deleting = mode === 'delete'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const cancelRef = useRef(null)
  const verb = creating ? '등록' : deleting ? '삭제' : '저장'

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const values = new FormData(event.currentTarget)
    const teacherId = Number(values.get('teacherId'))
    setError('')
    setBusy(true)
    try {
      if (creating) {
        await request(rulesPath, {
          method: 'POST',
          body: { roomId: Number(values.get('roomId')), category: values.get('category'), teacherId },
        })
      } else {
        const path = `${rulesPath}/${rule.roomId}/${rule.category}`
        await request(path, deleting ? { method: 'DELETE' } : { method: 'PUT', body: { teacherId } })
      }
      onSaved()
    } catch (cause) {
      setError(cause.code === 'L003'
        ? '이 장소와 카테고리의 규칙이 이미 있어요. 목록에서 담당 선생님을 수정해 주세요.'
        : cause.message || '요청을 처리하지 못했어요. 다시 시도해 주세요.')
      setBusy(false)
    }
  }

  return (
    <Modal
      title={creating ? '담당 규칙 등록' : deleting ? '담당 규칙 삭제' : '담당 규칙 수정'}
      description={rule && `${rule.placeName} · ${rule.roomName} / ${categoryLabels[rule.category] ?? rule.category}`}
      onClose={() => { if (!busy) onClose(Boolean(error)) }}
      initialFocusRef={deleting ? cancelRef : undefined}
    >
      <Form onSubmit={submit} aria-busy={busy}>
        {creating && (
          <>
            <label>장소(실)
              <select name="roomId" defaultValue="" required disabled={busy}>
                <option value="" disabled>실 선택</option>
                {rooms.map((room) => <option key={room.id} value={room.id}>{room.placeName} · {room.name}</option>)}
              </select>
            </label>
            <label>카테고리
              <select name="category" defaultValue="" required disabled={busy}>
                <option value="" disabled>카테고리 선택</option>
                {categories.map(([label, code]) => <option value={code} key={code}>{label}</option>)}
              </select>
            </label>
          </>
        )}
        {!deleting ? (
          <label>담당 선생님
            <select name="teacherId" defaultValue={managers.some((manager) => manager.id === rule?.teacherId) ? rule.teacherId : ''} required disabled={busy}>
              <option value="" disabled>선생님 선택</option>
              {managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name} ({manager.email})</option>)}
            </select>
          </label>
        ) : <p>삭제하면 이 조합으로 접수되는 새 신고는 담당자가 미지정돼요.</p>}
        {error && <p role="alert">{error}</p>}
        <Actions>
          <Button size="small" variant="secondary" ref={cancelRef} onClick={() => onClose(Boolean(error))} disabled={busy}>취소</Button>
          <Button type="submit" size="small" disabled={busy}>{busy ? '처리 중…' : verb}</Button>
        </Actions>
      </Form>
    </Modal>
  )
}

export default function AssignmentRulesPage() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState(null)
  const [dialog, setDialog] = useState(null)
  const [notice, setNotice] = useState('')
  const data = result?.attempt === attempt ? result : null

  useEffect(() => {
    let active = true
    Promise.all([request(rulesPath), fetchRooms(), fetchManagers()])
      .then(([rules, rooms, managers]) => {
        if (active) setResult({ attempt, rules, rooms, managers })
      })
      .catch((error) => {
        if (active) setResult({ attempt, error: error.message || '담당 규칙을 불러오지 못했어요.' })
      })
    return () => { active = false }
  }, [attempt])

  function closeDialog(reload) {
    setDialog(null)
    if (reload) setAttempt((current) => current + 1)
  }

  function openDialog(mode, rule) {
    setNotice('')
    setDialog({ mode, rule })
  }

  return (
    <Page>
      <Content>
        <Toolbar>
          <PageIntro title="담당 규칙 관리" description="실과 카테고리별로 새 신고를 담당할 선생님을 지정해요." />
          {data?.rules && (
            <Button size="medium" onClick={() => openDialog('create')} disabled={!data.rooms.length || !data.managers.length}>규칙 등록</Button>
          )}
        </Toolbar>
        <div role="status" hidden={!notice && Boolean(data)}>{notice || (!data && '담당 규칙을 불러오는 중이에요.')}</div>
        {data?.error && <div role="alert"><p>{data.error}</p><Button size="small" onClick={() => setAttempt((current) => current + 1)}>다시 시도</Button></div>}
        {data?.rules && (
          <Surface aria-label="담당 규칙 목록">
            {(!data.rooms.length || !data.managers.length) && <p>규칙을 등록하려면 선택할 실과 선생님 계정이 필요해요.</p>}
            {data.rules.length === 0 ? <p>등록된 담당 규칙이 없어요.</p> : (
              <ul>
                {data.rules.map((rule) => (
                  <li key={`${rule.roomId}-${rule.category}`}>
                    <span><small>{rule.placeName}</small><strong>{rule.roomName}</strong></span>
                    <span><small>카테고리</small>{categoryLabels[rule.category] ?? rule.category}</span>
                    <span><small>담당 선생님</small>{rule.teacherName}</span>
                    <Actions>
                      <Button size="small" variant="secondary" onClick={() => openDialog('edit', rule)} disabled={!data.managers.length}>수정</Button>
                      <Button size="small" variant="text" onClick={() => openDialog('delete', rule)}>삭제</Button>
                    </Actions>
                  </li>
                ))}
              </ul>
            )}
          </Surface>
        )}
        {dialog && data?.rules && (
          <RuleDialog {...dialog} rooms={data.rooms} managers={data.managers} onClose={closeDialog} onSaved={() => {
            setNotice({ create: '규칙을 등록했어요.', edit: '담당 선생님을 변경했어요.', delete: '규칙을 삭제했어요.' }[dialog.mode])
            closeDialog(true)
          }} />
        )}
      </Content>
    </Page>
  )
}
