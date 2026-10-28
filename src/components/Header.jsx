import styled from 'styled-components'
import logo from '../assets/Logo.png'

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 40px;
  border-bottom: 1px solid #f4cdde;
  background: #fff;

  .brand { display: flex; flex: 0 0 auto; width: 93.458px; height: 40px; margin-right: 40px; }
  .brand img { width: 100%; height: 100%; object-fit: contain; }
  nav ul { display: flex; gap: 28px; margin: 0; padding: 0; list-style: none; font-size: 16px; font-weight: 500; }
  p { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 0 auto; color: #474446; font-size: 14px; }
  svg { width: 20px; height: 20px; }

  @media (max-width: 720px) { padding: 0 20px; .brand { margin-right: 20px; } }
`

export default function Header({ brand, navigationLabel, userName, userRole, variant = 'user' }) {
  const navigationItems = variant === 'admin'
    ? [navigationLabel, '지도 관리']
    : [navigationLabel]

  return (
    <HeaderContainer>
      <div className="brand"><img src={logo} alt={brand} /></div>
      <nav aria-label="주요 메뉴">
        <ul>
          {navigationItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </nav>
      <p>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        {userName}{userRole && ` (${userRole})`}
      </p>
    </HeaderContainer>
  )
}
