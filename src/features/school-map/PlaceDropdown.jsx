import { useState } from 'react'
import styled from 'styled-components'

const Menu = styled.div`
  position: relative;
  z-index: 2;

  button {
    font: inherit;
    cursor: pointer;
  }
`

const Toggle = styled.button`
  display: inline-flex;
  box-sizing: border-box;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  height: 38px;
  padding: 8px 14px;
  border: 0;
  border-radius: 999px;
  background: ${({ $isSelected }) => $isSelected ? '#f7b6d4' : '#f4eef1'};
  color: ${({ $isSelected }) => $isSelected ? '#a3165f' : '#474446'};
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;

  svg {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
  }

  &:focus-visible { outline: 2px solid #b32e75; outline-offset: 3px; }
`

const Options = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: max-content;
  min-width: 180px;
  margin: 0;
  padding: 6px;
  border: 1px solid #f4cdde;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(114, 53, 83, .12);
  list-style: none;

  button {
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #2e2c2d;
    text-align: left;
    font-size: 14px;
    white-space: nowrap;
  }

  button[aria-current='true'] { background: #feedf6; color: #a3165f; }
  button:focus-visible { outline: 2px solid #b32e75; outline-offset: -2px; }
`

export default function PlaceDropdown({ places, selectedPlaceId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedPlace = places.find((place) => place.id === selectedPlaceId)

  function selectPlace(placeId) {
    onSelect(placeId)
    setIsOpen(false)
  }

  return (
    <Menu>
      <Toggle type="button" $isSelected={Boolean(selectedPlace)} aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {selectedPlace?.name ?? '창의관'}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Toggle>
      {isOpen && (
        <Options aria-label="층 선택">
          {places.map((place) => (
            <li key={place.id}>
              <button type="button" aria-current={place.id === selectedPlaceId} onClick={() => selectPlace(place.id)}>
                {place.name}
              </button>
            </li>
          ))}
        </Options>
      )}
    </Menu>
  )
}
