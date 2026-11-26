import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
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
  nav a { color: #615c5f; text-decoration: none; }
  nav [aria-current='page'] {
    color: ${({ theme }) => theme.schoolMap.color.accent};
    font-weight: 700;
  }
  .account { display: flex; align-items: center; gap: 12px; margin-left: auto; }
  p { display: inline-flex; align-items: center; gap: 8px; margin: 0; color: #474446; font-size: 14px; }
  svg { width: 20px; height: 20px; }
  .logout { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; padding: 0; border: 0; border-radius: 999px; background: transparent; color: #474446; cursor: pointer; }
  .logout:hover { background: #fdf1f6; color: #fa44a8; }
  .logout:focus-visible { outline: 2px solid #fa44a8; outline-offset: 2px; }
  .logout:disabled { opacity: 0.6; cursor: default; }

  @media (max-width: 720px) { padding: 0 20px; .brand { margin-right: 20px; } }

  @media (max-width: 480px) {
    padding: 0 12px;

    .brand { width: 72px; height: 32px; margin-right: 12px; }
    nav ul { gap: 12px; font-size: 13px; }
    p { gap: 4px; font-size: 12px; }
    svg { width: 18px; height: 18px; }
    .user-role { display: none; }
    .account { gap: 4px; }
    .logout { width: 32px; height: 32px; }
  }
`

export default function Header({ brand, navigationLabel, userName, userRole, variant = 'user', onLogout, loggingOut }) {
  return (
    <HeaderContainer>
      <div className="brand"><img src={logo} alt={brand} /></div>
      <nav aria-label="주요 메뉴">
        <ul>
          {variant === 'admin' && (
            <>
              <li><NavLink to="/manager/reports">교내 지도</NavLink></li>
              <li><NavLink to="/manager/map" end>지도 관리</NavLink></li>
              <li><NavLink to="/manager/assignment-rules" end>담당 규칙</NavLink></li>
            </>
          )}
          {(variant !== 'admin' || !['교내 지도', '담당 규칙'].includes(navigationLabel)) && <li aria-current="page">{navigationLabel}</li>}
        </ul>
      </nav>
      <div className="account">
        <p>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {userName}{userRole && <span className="user-role"> ({userRole})</span>}
        </p>
        {onLogout && (
          <button className="logout" type="button" aria-label="로그아웃" title="로그아웃" disabled={loggingOut} onClick={onLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        )}
      </div>
    </HeaderContainer>
  )
}
