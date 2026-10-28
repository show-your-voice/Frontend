import styled from 'styled-components'

const Intro = styled.header`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
  word-break: keep-all;
  overflow-wrap: anywhere;
`

const Heading = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.manager.color.title};
  font-size: ${({ theme }) => theme.manager.font.heading};
  font-weight: 600;
  line-height: ${({ theme }) => theme.manager.font.headingLineHeight};

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.manager.font.mobileHeading};
  }
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.manager.color.muted};
  font-size: ${({ theme }) => theme.manager.font.body};
  line-height: ${({ theme }) => theme.manager.font.lineHeight};

  @media (max-width: ${({ theme }) => theme.manager.layout.mobileBreakpoint}) {
    font-size: ${({ theme }) => theme.manager.font.mobileBody};
  }
`

export default function PageIntro({ title, description, headingId }) {
  return (
    <Intro>
      <Heading id={headingId}>{title}</Heading>
      {description && <Description>{description}</Description>}
    </Intro>
  )
}
