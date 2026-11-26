import styled from 'styled-components'

const MAX_VISIBLE_PAGES = 5

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[5]};
`

const Pages = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space[1]};
  margin: 0;
  padding: 0;
  list-style: none;
`

const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 ${({ theme }) => theme.space[2]};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, $current }) => ($current ? theme.report.color.selected : 'transparent')};
  color: ${({ theme, $current }) => ($current ? theme.report.color.selectedText : theme.report.color.body)};
  font: inherit;
  font-size: 14px;
  font-weight: ${({ $current }) => ($current ? 600 : 400)};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme, $current }) => ($current ? theme.report.color.selected : theme.report.color.hover)};
  }

  &:disabled {
    color: ${({ theme }) => theme.report.color.muted};
    opacity: 0.4;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.report.color.focus};
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

function visiblePages(page, totalPages) {
  const count = Math.min(MAX_VISIBLE_PAGES, totalPages)
  const start = Math.min(Math.max(page - Math.floor(count / 2), 0), totalPages - count)
  return Array.from({ length: count }, (_, index) => start + index)
}

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={direction === 'prev' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'} />
    </svg>
  )
}

export default function Pagination({ page, totalPages, onPageChange, label = '페이지 이동' }) {
  if (totalPages <= 1) return null

  return (
    <Nav aria-label={label}>
      <Pages>
        <li>
          <PageButton type="button" aria-label="이전 페이지" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
            <Arrow direction="prev" />
          </PageButton>
        </li>
        {visiblePages(page, totalPages).map((item) => (
          <li key={item}>
            <PageButton
              type="button"
              $current={item === page}
              aria-current={item === page ? 'page' : undefined}
              aria-label={`${item + 1}페이지`}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </PageButton>
          </li>
        ))}
        <li>
          <PageButton type="button" aria-label="다음 페이지" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
            <Arrow direction="next" />
          </PageButton>
        </li>
      </Pages>
    </Nav>
  )
}
