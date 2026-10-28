import styled from 'styled-components'

const Tag = styled.span`
  display: inline-block;
  max-width: 100%;
  padding: ${({ theme }) => theme.manager.layout.tagPaddingBlock}
    ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.manager.color.tagBackground};
  color: ${({ theme }) => theme.manager.color.tagText};
  font-size: ${({ theme }) => theme.manager.font.label};
  font-weight: 500;
  line-height: ${({ theme }) => theme.manager.font.lineHeight};
  word-break: keep-all;
  overflow-wrap: anywhere;

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    padding-inline: ${({ theme }) => theme.space[3]};
    font-size: ${({ theme }) => theme.manager.font.mobileLabel};
  }
`

export default function LocationTag({ children }) {
  return <Tag>{children}</Tag>
}
