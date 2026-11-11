import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import Modal from '../../components/Modal.jsx'
import { addReportCoAssignee, fetchManagers } from './reportApi.js'

const CoAssigneeModal = styled(Modal)`
  position: relative;
  max-width: ${({ theme }) => theme.report.coAssignee.width};
  padding: ${({ theme }) => theme.report.coAssignee.padding};

  > h2 { font-size: ${({ theme }) => theme.report.coAssignee.titleSize}; }
  > p { font-size: ${({ theme }) => theme.report.coAssignee.descriptionSize}; }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    padding: ${({ theme }) => theme.space[6]};

    > h2 { font-size: ${({ theme }) => theme.report.font.body}; }
    > p { font-size: ${({ theme }) => theme.report.coAssignee.mobileTextSize}; }
  }
`

const ModalForm = styled.form`
  margin: 0;
`

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.space[6]};
  right: ${({ theme }) => theme.space[6]};
  display: grid;
  width: ${({ theme }) => theme.report.coAssignee.closeSize};
  height: ${({ theme }) => theme.report.coAssignee.closeSize};
  padding: ${({ theme }) => theme.space[2]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.report.color.body};
  cursor: pointer;

  svg { width: 100%; height: 100%; }
  &:hover { background: ${({ theme }) => theme.report.color.hover}; }
  &:active { background: ${({ theme }) => theme.report.color.detailSurface}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    top: ${({ theme }) => theme.space[4]};
    right: ${({ theme }) => theme.space[4]};
  }
`

const SearchField = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[8]};

  label {
    color: ${({ theme }) => theme.report.color.title};
    font-size: ${({ theme }) => theme.report.coAssignee.labelSize};
    font-weight: 600;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: ${({ theme }) => theme.report.coAssignee.searchHeight};
  padding: 0 ${({ theme }) => theme.space[6]};
  border: 2px solid ${({ theme }) => theme.report.color.focus};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.report.color.surface};
  color: ${({ theme }) => theme.report.color.title};
  font: inherit;
  font-size: ${({ theme }) => theme.report.font.body};
  outline: none;

  &::placeholder { color: ${({ theme }) => theme.report.color.muted}; }
  &:focus-visible {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.report.color.detailSurface};
  }
  &:disabled { cursor: wait; opacity: 0.72; }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    height: ${({ theme }) => theme.report.detail.deleteHeight};
    padding-inline: ${({ theme }) => theme.space[4]};
    font-size: ${({ theme }) => theme.report.coAssignee.mobileTextSize};
  }
`

const Results = styled.div`
  margin-top: ${({ theme }) => theme.report.coAssignee.resultsMargin};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.report.color.border};
  border-radius: ${({ theme }) => theme.report.radius.card};
  background: ${({ theme }) => theme.report.color.surface};
`

const ResultState = styled.div`
  display: grid;
  justify-items: center;
  gap: ${({ theme }) => theme.space[4]};
  min-height: ${({ theme }) => theme.report.coAssignee.rowHeight};
  padding: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.report.color.body};
  text-align: center;

  p { margin: 0; }
`

const RetryButton = styled.button`
  min-height: 44px;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[5]};
  border: 1px solid ${({ theme }) => theme.report.color.border};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.report.color.surface};
  color: ${({ theme }) => theme.report.color.focus};
  font: inherit;
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.report.color.hover}; }
  &:active { background: ${({ theme }) => theme.report.color.detailSurface}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 2px;
  }
`

const ManagerOption = styled.label`
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  min-height: ${({ theme }) => theme.report.coAssignee.rowHeight};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  background: ${({ theme, $selected }) => $selected ? theme.report.color.detailSurface : theme.report.color.surface};
  color: ${({ theme }) => theme.report.color.title};
  cursor: pointer;

  & + & { border-top: 1px solid ${({ theme }) => theme.report.color.border}; }
  &:hover { background: ${({ theme }) => theme.report.color.hover}; }
  &:has(input:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: -3px;
  }
  &:has(input:disabled) { cursor: wait; opacity: 0.72; }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`

const ManagerIcon = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.report.color.hover};
  color: ${({ theme }) => theme.report.color.body};

  svg { width: 24px; height: 24px; }
`

const ManagerIdentity = styled.span`
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: ${({ theme }) => theme.report.coAssignee.resultSize};
  font-weight: 500;

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    font-size: ${({ theme }) => theme.report.coAssignee.mobileTextSize};
  }
`

const CheckIcon = styled.svg`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.report.color.focus};
`

const SubmitError = styled.p`
  margin: ${({ theme }) => theme.space[4]} 0 0;
  color: ${({ theme }) => theme.report.modal.color.dangerActive};
  font-size: ${({ theme }) => theme.report.coAssignee.mobileSecondarySize};
  text-align: center;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    grid-template-columns: 1fr;
  }
`

const ActionButton = styled.button`
  min-height: ${({ theme }) => theme.report.coAssignee.actionHeight};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[5]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $primary }) => $primary ? theme.report.color.focus : theme.report.modal.color.cancel};
  color: ${({ theme, $primary }) => $primary ? theme.report.color.surface : theme.report.color.title};
  font: inherit;
  font-size: ${({ theme }) => theme.report.coAssignee.actionSize};
  cursor: pointer;

  &:hover:not(:disabled) { background: ${({ theme, $primary }) => $primary ? theme.report.color.selectedText : theme.report.color.hover}; }
  &:active:not(:disabled) { background: ${({ theme, $primary }) => $primary ? theme.report.color.selectedText : theme.report.color.detailSurface}; }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 3px;
  }
  &:disabled { cursor: default; opacity: 0.52; }

  @media (max-width: ${({ theme }) => theme.report.detail.compactBreakpoint}) {
    min-height: ${({ theme }) => theme.report.detail.deleteHeight};
    font-size: ${({ theme }) => theme.report.coAssignee.mobileTextSize};
  }
`

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export default function ReportCoAssigneeModal({ report, onCancel, onAdded }) {
  const searchInputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [managers, setManagers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [requestVersion, setRequestVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    let ignore = false

    fetchManagers()
      .then((nextManagers) => {
        if (!ignore) setManagers(nextManagers)
      })
      .catch(() => {
        if (!ignore) setLoadError('관리자 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [requestVersion])

  const excludedIds = useMemo(
    () => new Set([report.primaryAssigneeId, ...report.coAssignees.map((manager) => manager.id)]
      .filter((id) => id !== null && id !== undefined)
      .map(String)),
    [report],
  )
  const normalizedQuery = query.trim().toLocaleLowerCase('ko-KR')
  const availableManagers = managers.filter((manager) => !excludedIds.has(String(manager.id)))
  const visibleManagers = availableManagers.filter((manager) => {
    if (!normalizedQuery) return true
    return manager.name.toLocaleLowerCase('ko-KR').includes(normalizedQuery)
      || (manager.email ?? '').toLocaleLowerCase('ko-KR').includes(normalizedQuery)
  })

  function retryManagers() {
    setIsLoading(true)
    setLoadError('')
    setRequestVersion((version) => version + 1)
  }

  function changeQuery(event) {
    setQuery(event.target.value)
    setSelectedId(null)
    setSubmitError('')
  }

  async function addManager() {
    if (selectedId === null || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')
    try {
      const updatedReport = await addReportCoAssignee(report.id, selectedId)
      onAdded(updatedReport)
    } catch {
      setSubmitError('공동 담당자를 추가하지 못했어요. 잠시 후 다시 시도해 주세요.')
      setIsSubmitting(false)
    }
  }

  function submitManager(event) {
    event.preventDefault()
    addManager()
  }

  return (
    <CoAssigneeModal
      title="공동 담당자 추가"
      description="이 신고를 함께 처리할 관리자를 선택하세요."
      onClose={isSubmitting ? () => {} : onCancel}
      initialFocusRef={searchInputRef}
    >
      <CloseButton type="button" onClick={onCancel} disabled={isSubmitting} aria-label="공동 담당자 추가 닫기" title="닫기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </CloseButton>
      <ModalForm onSubmit={submitManager}>
        <SearchField>
          <label htmlFor="co-assignee-search">관리자 검색</label>
          <SearchInput
            id="co-assignee-search"
            ref={searchInputRef}
            value={query}
            onChange={changeQuery}
            placeholder="이름 또는 이메일을 입력하세요"
            autoComplete="off"
            autoFocus
            disabled={isSubmitting}
          />
        </SearchField>
        <Results role={visibleManagers.length > 0 ? 'radiogroup' : undefined} aria-label={visibleManagers.length > 0 ? '공동 담당자 검색 결과' : undefined}>
          {isLoading && <ResultState role="status" aria-live="polite"><p>관리자 목록을 불러오는 중이에요.</p></ResultState>}
          {!isLoading && loadError && (
            <ResultState role="alert">
              <p>{loadError}</p>
              <RetryButton type="button" onClick={retryManagers}>다시 시도</RetryButton>
            </ResultState>
          )}
          {!isLoading && !loadError && visibleManagers.length === 0 && (
            <ResultState role="status"><p>{normalizedQuery ? '검색 결과가 없어요.' : '추가할 수 있는 관리자가 없어요.'}</p></ResultState>
          )}
          {!isLoading && !loadError && visibleManagers.map((manager) => {
            const selected = manager.id === selectedId
            return (
              <ManagerOption key={manager.id} $selected={selected}>
                <input
                  type="radio"
                  name="co-assignee"
                  value={manager.id}
                  checked={selected}
                  onChange={() => {
                    setSelectedId(manager.id)
                    setSubmitError('')
                  }}
                  disabled={isSubmitting}
                />
                <ManagerIcon><PersonIcon /></ManagerIcon>
                <ManagerIdentity>{manager.name}</ManagerIdentity>
                {selected && (
                  <CheckIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12 4 4L19 6" />
                  </CheckIcon>
                )}
              </ManagerOption>
            )
          })}
        </Results>
        {submitError && <SubmitError role="alert">{submitError}</SubmitError>}
        <Actions>
          <ActionButton type="button" onClick={onCancel} disabled={isSubmitting}>취소</ActionButton>
          <ActionButton type="submit" $primary disabled={selectedId === null || isLoading || Boolean(loadError) || isSubmitting}>
            {isSubmitting ? '추가 중…' : '추가하기'}
          </ActionButton>
        </Actions>
      </ModalForm>
    </CoAssigneeModal>
  )
}
