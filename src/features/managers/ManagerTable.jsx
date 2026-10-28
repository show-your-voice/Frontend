import styled from 'styled-components'
import ManagerTableRow from './ManagerTableRow.jsx'

const Surface = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.manager.layout.radius};
  background: ${({ theme }) => theme.manager.color.surface};

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: ${({ theme }) => theme.manager.color.body};
  font-size: ${({ theme }) => theme.manager.font.body};
  line-height: ${({ theme }) => theme.manager.font.lineHeight};

  col:first-child {
    width: ${({ theme }) => theme.manager.layout.nameColumn};
  }

  col:nth-child(2) {
    width: ${({ theme }) => theme.manager.layout.emailColumn};
  }

  thead {
    background: ${({ theme }) => theme.manager.color.tableHeader};
    color: ${({ theme }) => theme.manager.color.muted};
    font-size: ${({ theme }) => theme.manager.font.label};
  }

  thead th {
    padding: ${({ theme }) => theme.manager.layout.headerPaddingBlock}
      ${({ theme }) => theme.manager.layout.cellPaddingInline};
    font-weight: 500;
    text-align: left;
    word-break: keep-all;
  }

  @media (max-width: ${({ theme }) => theme.manager.layout.tabletBreakpoint}) {
    col:first-child {
      width: ${({ theme }) => theme.manager.layout.tabletNameColumn};
    }

    col:nth-child(2) {
      width: ${({ theme }) => theme.manager.layout.tabletEmailColumn};
    }

    thead th {
      padding-inline: ${({ theme }) => theme.space[6]};
    }
  }

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    display: block;
    font-size: ${({ theme }) => theme.manager.font.mobileBody};

    colgroup {
      display: none;
    }

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }

    tbody {
      display: block;
    }
  }
`

const EmptyCell = styled.td`
  padding: ${({ theme }) => theme.space[12]} ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.manager.color.muted};
  text-align: center;
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    display: block;
  }
`

export default function ManagerTable({ managers = [], labelledBy }) {
  return (
    <Surface>
      <Table role="table" aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : '담당자 정보'}>
        <colgroup><col /><col /><col /></colgroup>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">담당자</th>
            <th scope="col" role="columnheader">담당자 이메일</th>
            <th scope="col" role="columnheader">담당 장소</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {managers.length > 0 ? managers.map((manager) => (
            <ManagerTableRow key={manager.id} manager={manager} />
          )) : (
            <tr role="row">
              <EmptyCell role="cell" colSpan={3}>등록된 담당자 정보가 없어요.</EmptyCell>
            </tr>
          )}
        </tbody>
      </Table>
    </Surface>
  )
}
