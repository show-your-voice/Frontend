import styled, { keyframes } from 'styled-components'

const riseIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Page = styled.div`
  min-height: 100dvh;
  color: ${({ theme }) => theme.color.textPrimary};
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[4]};
  width: min(100% - 32px, 1180px);
  min-height: 72px;
  margin-inline: auto;
  padding-block: ${({ theme }) => theme.space[4]};
`

const Brand = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.01em;
`

const BrandMark = styled.span`
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surfaceElevated};
  box-shadow: ${({ theme }) => theme.shadow.card};
`

const BrandPulse = styled.span`
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.accentPrimary};
`

const HeaderAction = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surfaceWarm};
  color: ${({ theme }) => theme.color.textPrimary};
  box-shadow: ${({ theme }) => theme.shadow.warmLift};
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    transform 120ms ease-out,
    box-shadow 120ms ease-out;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.focusRing};
    outline-offset: 3px;
  }
`

const Main = styled.main`
  width: min(100% - 32px, 1180px);
  margin-inline: auto;
`

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(280px, 0.74fr);
  align-items: center;
  gap: clamp(32px, 7vw, 88px);
  min-height: calc(100dvh - 96px);
  padding-block: clamp(48px, 9vw, 96px);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-block: ${({ theme }) => theme.space[12]};
  }
`

const HeroCopy = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  animation: ${riseIn} 520ms cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Eyebrow = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textTertiary};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
`

const Title = styled.h1`
  max-width: 10ch;
  margin: 0;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 300;
  line-height: 1.02;
  letter-spacing: -0.03em;
`

const Lead = styled.p`
  max-width: 58ch;
  margin: 0;
  color: ${({ theme }) => theme.color.textSecondary};
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  letter-spacing: 0.01em;
`

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
`

const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[5]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $variant, theme }) =>
    $variant === 'secondary' ? theme.color.surfaceWarm : theme.color.accentPrimary};
  color: ${({ $variant, theme }) =>
    $variant === 'secondary' ? theme.color.textPrimary : theme.color.surfacePrimary};
  box-shadow: ${({ $variant, theme }) =>
    $variant === 'secondary' ? theme.shadow.warmLift : 'none'};
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition:
    transform 120ms ease-out,
    filter 120ms ease-out;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color.focusRing};
    outline-offset: 3px;
  }
`

const VisualCard = styled.aside`
  display: grid;
  gap: ${({ theme }) => theme.space[6]};
  padding: clamp(24px, 4vw, 40px);
  border: 1px solid ${({ theme }) => theme.color.borderDefault};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: color-mix(in srgb, ${({ theme }) => theme.color.surfaceElevated} 88%, transparent);
  box-shadow: ${({ theme }) => theme.shadow.card};
  animation: ${riseIn} 620ms 90ms cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const Waveform = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 1vw, 12px);
  min-height: 240px;
  border-radius: ${({ theme }) => theme.radius.md};
  background:
    linear-gradient(135deg, color-mix(in srgb, ${({ theme }) => theme.color.surfaceWarm} 92%, transparent), transparent),
    ${({ theme }) => theme.color.surfaceSecondary};
`

const WaveBar = styled.span`
  width: clamp(8px, 1.2vw, 14px);
  height: ${({ $height }) => $height};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.accentPrimary};
  opacity: ${({ $tone }) => $tone};
`

const CardText = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.18;
  letter-spacing: -0.01em;
`

const CardBody = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textSecondary};
  line-height: 1.6;
`

const Footer = styled.footer`
  width: min(100% - 32px, 1180px);
  margin-inline: auto;
  padding-block: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.color.textTertiary};
  font-size: 0.875rem;
`

export default function App() {
  const bars = [
    ['22%', 0.48],
    ['48%', 0.7],
    ['72%', 0.96],
    ['38%', 0.62],
    ['86%', 1],
    ['54%', 0.76],
    ['28%', 0.5],
    ['64%', 0.86],
  ]

  return (
    <Page>
      <Header>
        <Brand href="/" aria-label="Show Your Voice home">
          <BrandMark aria-hidden="true">
            <BrandPulse />
          </BrandMark>
          Show Your Voice
        </Brand>
        <HeaderAction href="https://vite.dev" target="_blank" rel="noreferrer">
          Vite ready
        </HeaderAction>
      </Header>

      <Main>
        <Hero>
          <HeroCopy>
            <Eyebrow>React + Vite + styled-components</Eyebrow>
            <Title>Show your voice.</Title>
            <Lead>
              A frontend foundation for shaping voice-led product moments with a
              fast React setup, tokenized styling, and a calm starter interface.
            </Lead>
            <ActionRow>
              <Button href="https://react.dev" target="_blank" rel="noreferrer">
                React docs
              </Button>
              <Button
                href="https://styled-components.com"
                target="_blank"
                rel="noreferrer"
                $variant="secondary"
              >
                Styling docs
              </Button>
            </ActionRow>
          </HeroCopy>

          <VisualCard aria-label="Starter visual motif">
            <Waveform aria-hidden="true">
              {bars.map(([height, tone], index) => (
                <WaveBar key={`${height}-${index}`} $height={height} $tone={tone} />
              ))}
            </Waveform>
            <CardText>
              <CardTitle>Styled system first</CardTitle>
              <CardBody>
                Theme tokens, global styles, responsive layout, and development
                diagnostics are already wired so the next feature can start cleanly.
              </CardBody>
            </CardText>
          </VisualCard>
        </Hero>
      </Main>

      <Footer>Built for local development. Run npm run dev to start.</Footer>
    </Page>
  )
}
