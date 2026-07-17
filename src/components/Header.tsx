import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { nav, site } from '../data/site';
import Button from './Button';
import './Header.css';

export default function Header() {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="site-header__logo" aria-label="Adam Hall Buy My Car — home">
          <img src="/assets/logos/logo-black.svg" alt="Adam Hall Buy My Car" width={200} height={90} />
        </Link>

        {/* Right side: nav row with the phone pill below it (matches the live site) */}
        <div className="site-header__right">
          <nav className="site-header__nav" aria-label="Primary">
            <ul>
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Button href={site.phoneHref} variant="purple" className="btn--bubble site-header__phone">
            {site.phoneDisplay}
          </Button>
        </div>

        <button
          className={`burger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <Button href={site.phoneHref} variant="purple" className="mobile-menu__call">
          Call Adam {site.phoneDisplay}
        </Button>
      </div>
    </header>
  );
}
