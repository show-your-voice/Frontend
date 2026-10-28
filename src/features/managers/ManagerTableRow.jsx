import styled from 'styled-components'
import ManagerLocations from './ManagerLocations.jsx'

const Row = styled.tr`
  height: ${({ theme }) => theme.manager.layout.rowHeight};

  > th,
  > td {
    padding: ${({ theme }) => theme.space[6]}
      ${({ theme }) => theme.manager.layout.cellPaddingInline};
    border-top: 1px solid ${({ theme }) => theme.manager.color.border};
    vertical-align: middle;
    font-weight: 400;
    text-align: left;
    overflow-wrap: anywhere;
  }

  > th {
    font-weight: 500;
    word-break: keep-all;
  }

  > td:first-of-type {
    color: ${({ theme }) => theme.manager.color.muted};
  }

  @media (max-width: ${({ theme }) => theme.manager.layout.tabletBreakpoint}) {
    > th,
    > td {
      padding-inline: ${({ theme }) => theme.space[6]};
    }
  }

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    align-items: center;
    gap: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[3]};
    height: auto;
    padding: ${({ theme }) => theme.space[5]};
    border-top: 1px solid ${({ theme }) => theme.manager.color.border};

    &:first-child {
      border-top: 0;
    }

    > th,
    > td {
      min-width: 0;
      padding: 0;
      border: 0;
    }

    > td:last-child {
      grid-column: 1 / -1;
    }
  }
`

export default function ManagerTableRow({ manager }) {
  return (
    <Row role="row">
      <th scope="row" role="rowheader">{manager.name || '—'}</th>
      <td role="cell">{manager.email || '—'}</td>
      <td role="cell"><ManagerLocations locations={manager.locations} /></td>
    </Row>
  )
}
