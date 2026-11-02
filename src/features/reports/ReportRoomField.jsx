import { useState } from 'react'
import styled from 'styled-components'
import TextField from '../../components/TextField.jsx'
import { MAX_ROOM_OPTIONS } from './reportFormValidation.js'

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.reportForm.layout.dropdownOffset});
  right: 0;
  left: 0;
  z-index: 10;
  padding: ${({ theme }) => theme.reportForm.layout.dropdownPadding};
  border: 1px solid ${({ theme }) => theme.auth.color.border};
  border-radius: ${({ theme }) => theme.reportForm.layout.dropdownRadius};
  background: ${({ theme }) => theme.auth.color.surface};
`

const Options = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.reportForm.layout.dropdownGap};
  margin: 0;
  padding: 0;
  list-style: none;
`

const Option = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.reportForm.layout.optionGap};
  padding: ${({ theme }) => theme.reportForm.layout.optionPaddingBlock} ${({ theme }) => theme.reportForm.layout.optionPaddingInline};
  border-radius: ${({ theme }) => theme.reportForm.layout.optionRadius};
  background: ${({ theme, $active }) => $active ? theme.reportForm.color.optionActive : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.auth.color.brand : theme.auth.color.textSecondary};
  cursor: pointer;

  svg {
    flex-shrink: 0;
    width: ${({ theme }) => theme.reportForm.layout.pinSize};
    height: ${({ theme }) => theme.reportForm.layout.pinSize};
  }
`

const OptionText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  strong {
    color: ${({ theme, $active }) => $active ? theme.reportForm.color.optionActiveText : theme.auth.color.textPrimary};
    font-size: ${({ theme }) => theme.auth.font.label};
    font-weight: 500;
  }

  span {
    color: ${({ theme }) => theme.auth.color.textTertiary};
    font-size: ${({ theme }) => theme.auth.font.caption};
  }

  strong,
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const Empty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.reportForm.layout.optionPaddingBlock} ${({ theme }) => theme.reportForm.layout.optionPaddingInline};
  color: ${({ theme }) => theme.auth.color.textTertiary};
  font-size: ${({ theme }) => theme.auth.font.label};
`

function formatLocation(room) {
  return `${room.building} ${room.floor}층`
}

function formatRoom(room) {
  return `${room.name} · ${formatLocation(room)}`
}

function normalize(text) {
  return text.replace(/\s/g, '').toLowerCase()
}

export default function ReportRoomField({ id, name, rooms, value, error, onChange }) {
  const selectedRoom = rooms.find((room) => room.id === value)
  const [query, setQuery] = useState(selectedRoom ? formatRoom(selectedRoom) : '')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const keyword = normalize(query)
  const results = keyword
    ? rooms.filter((room) => normalize(room.name).includes(keyword)).slice(0, MAX_ROOM_OPTIONS)
    : []
  const expanded = open && Boolean(keyword) && !selectedRoom
  const listId = `${id}-options`
  const optionId = (index) => `${id}-option-${index}`

  function selectRoom(room) {
    onChange(room.id)
    setQuery(formatRoom(room))
    setOpen(false)
  }

  function handleInput(event) {
    setQuery(event.target.value)
    setActiveIndex(0)
    setOpen(true)
    if (value) onChange('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!expanded || results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((activeIndex + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((activeIndex - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      selectRoom(results[activeIndex])
    }
  }

  return (
    <TextField
      id={id}
      name={name}
      label="실 정보"
      placeholder="실 이름을 입력해 검색하세요"
      helper={expanded ? undefined : '불편이 있는 실(교실·화장실 등)의 이름을 적어 주세요.'}
      error={error}
      autoComplete="off"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={expanded && results.length > 0}
      aria-controls={expanded && results.length > 0 ? listId : undefined}
      aria-activedescendant={expanded && results.length > 0 ? optionId(activeIndex) : undefined}
      value={query}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {expanded && (
        <Dropdown>
          {results.length > 0 ? (
            <Options id={listId} role="listbox" aria-label="실 검색 결과">
              {results.map((room, index) => (
                <Option
                  key={room.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  $active={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectRoom(room)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <OptionText $active={index === activeIndex}>
                    <strong>{room.name}</strong>
                    <span>{formatLocation(room)}</span>
                  </OptionText>
                </Option>
              ))}
            </Options>
          ) : (
            <Empty role="status">일치하는 실이 없어요.</Empty>
          )}
        </Dropdown>
      )}
    </TextField>
  )
}
