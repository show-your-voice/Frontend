import styled from 'styled-components'
import Button from '../../components/Button.jsx'
import AuthBrandPanel from './AuthBrandPanel.jsx'

const Page = styled.main`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.auth.layout.columnWidth} minmax(0, ${({ theme }) => theme.auth.layout.columnWidth});
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 44px 0 32px;
  background: ${({ theme }) => theme.auth.color.background};
  font-family: ${({ theme }) => theme.auth.font.family};
  line-height: ${({ theme }) => theme.auth.font.lineHeight};
  letter-spacing: ${({ theme }) => theme.auth.font.letterSpacing};
  color-scheme: light;

  @media (max-width: ${({ theme }) => theme.auth.layout.brandBreakpoint}) {
    grid-template-columns: minmax(0, ${({ theme }) => theme.auth.layout.formWidth});
    padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[4]};
  }
`

const Brand = styled.div`
  @media (max-width: ${({ theme }) => theme.auth.layout.brandBreakpoint}) {
    display: none;
  }
`

const FormColumn = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.space[4]};

  @media (max-width: ${({ theme }) => theme.auth.layout.brandBreakpoint}) {
    padding: 0;
  }
`

const Card = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.auth.layout.formGap};
  width: 100%;
  max-width: ${({ theme }) => theme.auth.layout.formWidth};
  padding: ${({ theme }) => theme.auth.layout.formPadding};
  border-radius: ${({ theme }) => theme.auth.radius.form};
  background: ${({ theme }) => theme.auth.color.surface};

  @media (max-width: ${({ theme }) => theme.auth.layout.mobileBreakpoint}) {
    padding: ${({ theme }) => theme.auth.layout.mobileFormPadding};
  }
`

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.auth.layout.fieldGap};
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textPrimary};
  font-size: ${({ theme }) => theme.auth.font.heading};
  font-weight: 700;
  line-height: inherit;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textTertiary};
  font-size: ${({ theme }) => theme.auth.font.label};
  word-break: keep-all;
`

const Footer = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 2px;
  margin: 0;
  color: ${({ theme }) => theme.auth.color.textTertiary};
  font-size: ${({ theme }) => theme.auth.font.label};
`

export default function AuthLayout({
  title,
  description,
  submitLabel,
  footerText,
  footerActionLabel,
  onFooterAction,
  onSubmit,
  children,
}) {
  return (
    <Page>
      <Brand>
        <AuthBrandPanel />
      </Brand>
      <FormColumn>
        <Card noValidate onSubmit={onSubmit} aria-labelledby="auth-title">
          <Heading>
            <Title id="auth-title">{title}</Title>
            <Description>{description}</Description>
          </Heading>
          {children}
          <Button type="submit">{submitLabel}</Button>
          <Footer>
            {footerText}
            <Button variant="text" onClick={onFooterAction}>{footerActionLabel}</Button>
          </Footer>
        </Card>
      </FormColumn>
    </Page>
  )
}
