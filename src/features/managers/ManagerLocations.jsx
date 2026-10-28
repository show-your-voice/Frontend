import styled from 'styled-components'
import LocationTag from '../../components/LocationTag.jsx'

const Locations = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.manager.layout.tagGap};
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    max-width: 100%;
  }
`

export default function ManagerLocations({ locations = [] }) {
  if (locations.length === 0) return '—'

  return (
    <Locations aria-label="담당 장소" role="list">
      {locations.map((location) => (
        <li key={location}><LocationTag>{location}</LocationTag></li>
      ))}
    </Locations>
  )
}
