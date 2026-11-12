import { useState } from 'react'
import styled from 'styled-components'
import { buildingFloorPattern } from './schoolMapPreviewData.js'

const Menu = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  gap: 8px;
`

const MenuAnchor = styled.div`
  position: relative;
`

const Toggle = styled.button`
  display: inline-flex;
  box-sizing: border-box;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  padding: ${({ theme }) => theme.reportForm.layout.chipPaddingBlock} ${({ theme }) => theme.reportForm.layout.chipPaddingInline};
  border: 0;
  border-radius: 999px;
  background: ${({ theme, $isSelected }) => $isSelected ? theme.schoolMap.color.selected : theme.schoolMap.color.chip};
  color: ${({ theme, $isSelected }) => $isSelected ? theme.schoolMap.color.accentText : theme.schoolMap.color.secondaryText};
  font-size: ${({ theme }) => theme.schoolMap.font.label};
  font-weight: ${({ theme }) => theme.schoolMap.font.labelWeight};
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  white-space: nowrap;
  cursor: pointer;

  svg {
    flex: 0 0 16px;
    width: 16px;
    height: 16px;
  }

  &:focus-visible { outline: 2px solid ${({ theme }) => theme.schoolMap.color.focus}; outline-offset: 3px; }
`

const Options = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-start: 0;
  width: max-content;
  min-width: 100%;
  max-height: min(440px, 65dvh);
  overflow-y: auto;
  margin: 0;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.schoolMap.color.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.schoolMap.color.surface};
  box-shadow: 0 10px 24px rgba(114, 53, 83, .12);
  list-style: none;

  button {
    width: 100%;
    padding: 10px 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: ${({ theme }) => theme.schoolMap.color.text};
    text-align: left;
    font-size: ${({ theme }) => theme.schoolMap.font.label};
    font-weight: ${({ theme }) => theme.schoolMap.font.labelWeight};
    white-space: nowrap;
    cursor: pointer;
  }

  button[aria-current='true'] { background: ${({ theme }) => theme.schoolMap.color.passage}; color: ${({ theme }) => theme.schoolMap.color.accentText}; }
  button:focus-visible { outline: 2px solid ${({ theme }) => theme.schoolMap.color.focus}; outline-offset: -2px; }
`

export default function PlaceDropdown({ places, selectedPlaceId, onSelect }) {
  const [openBuilding, setOpenBuilding] = useState(null)
  const buildings = ['창의관', '우정관'].map((name) => ({
    name,
    places: places.filter((place) => buildingFloorPattern.exec(place.name)?.[1] === name),
  })).filter((building) => building.places.length > 0)
  function selectPlace(placeId) {
    onSelect(placeId)
    setOpenBuilding(null)
  }

  return (
    <Menu onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpenBuilding(null)
    }}>
      {buildings.map(({ name, places: buildingPlaces }) => {
        const selectedPlace = buildingPlaces.find((place) => place.id === selectedPlaceId)
        const isOpen = openBuilding === name

        return (
          <MenuAnchor key={name}>
            <Toggle type="button" $isSelected={Boolean(selectedPlace)} aria-expanded={isOpen} onClick={() => setOpenBuilding((current) => current === name ? null : name)}>
              {selectedPlace?.name ?? name}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Toggle>
            {isOpen && (
              <Options aria-label={`${name} 층 선택`}>
                {buildingPlaces.map((place) => (
                  <li key={place.id}>
                    <button type="button" aria-current={place.id === selectedPlaceId} onClick={() => selectPlace(place.id)}>
                      {place.name}
                    </button>
                  </li>
                ))}
              </Options>
            )}
          </MenuAnchor>
        )
      })}
    </Menu>
  )
}
