import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as LogoSvg } from '../assets/images/logosim.svg';
import { getProfile, isTeacher, logout } from '../services/api';
import { isAuthenticated, onSessionChange } from '../services/session';
import { UserFilledIcon } from './CabinetIcons';
import '../style/Header.css';

const NAV_LINKS = [
  { to: '/game', label: 'Игра' },
  { to: '/courses', label: 'Курсы' },
  { to: '/construct', label: 'Конструктор' },
  { to: '/partner', label: 'Партнёры' }
];

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [profile, setProfile] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Вход и выход (в том числе в другой вкладке или по истечении сессии)
  useEffect(() => onSessionChange(() => setIsAuth(isAuthenticated())), []);

  // При переходе на другую страницу закрываем меню
  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [location]);

  // Профиль нужен для инициалов и пункта меню: преподавателю «Мои группы», студенту «Мои оценки»
  // Перечитываем при смене страницы: роль могли выдать, пока пользователь был на сайте
  useEffect(() => {
    if (!isAuth) {
      setProfile(null);
      return;
    }

    let cancelled = false;
    getProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isAuth, location.pathname]);

  // Линия под шапкой появляется, когда страница прокручена
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Меню профиля закрывается по клику вне него и по Esc
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/auth');
  };

  const initials = `${profile?.lastName?.[0] || ''}${profile?.firstName?.[0] || ''}`.toUpperCase();
  const fullName = [profile?.lastName, profile?.firstName].filter(Boolean).join(' ');

  return (
    <header className={`hdr ${scrolled ? 'hdr-scrolled' : ''}`}>
      <div className="hdr-inner">
        <Link to="/" className="hdr-logo" aria-label="На главную">
          <LogoSvg className="hdr-logo-svg" />
        </Link>

        <nav className={`hdr-nav ${navOpen ? 'hdr-nav-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
          ))}
        </nav>

        <div className="hdr-right">
          {isAuth ? (
            <div className="hdr-profile" ref={menuRef}>
              <button
                type="button"
                className="hdr-avatar-btn"
                onClick={() => {
                  setMenuOpen(!menuOpen);
                  setNavOpen(false);
                }}
                aria-label="Меню профиля"
                aria-expanded={menuOpen}
              >
                <span className="hdr-avatar">{initials || <UserFilledIcon size={20} />}</span>
                <svg className="hdr-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div className="hdr-menu">
                  {profile && (
                    <div className="hdr-menu-user">
                      <div className="hdr-menu-name">{fullName || 'Профиль'}</div>
                      <div className="hdr-menu-email">{profile.email}</div>
                    </div>
                  )}
                  <Link to="/profile">Личный кабинет</Link>
                  {profile && (
                    isTeacher(profile)
                      ? <Link to="/groups">Мои группы</Link>
                      : <Link to="/grades">Мои оценки</Link>
                  )}
                  <button type="button" className="hdr-menu-logout" onClick={handleLogout}>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="hdr-login">Войти</Link>
          )}

          <button
            type="button"
            className="hdr-burger"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Меню"
            aria-expanded={navOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {navOpen
                ? <path d="M6 6l12 12M18 6L6 18" />
                : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
