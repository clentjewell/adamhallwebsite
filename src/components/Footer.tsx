import { Link } from 'react-router-dom';
import { nav, site, preFooterTrust } from '../data/site';
import './Footer.css';

export default function Footer() {
  return (
    <>
      {/* Black pre-footer trust band */}
      <section className="prefooter" aria-label="Why choose Adam Hall">
        <div className="container container--wide">
          <ul className="prefooter__items">
            {preFooterTrust.map((t) => (
              <li key={t}>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path
                    d="M20 6L9 17l-5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          <div className="prefooter__wave" aria-hidden="true" />
        </div>
      </section>

      <footer className="site-footer">
        <div className="container container--wide site-footer__grid">
          <div className="site-footer__brand">
            <Link to="/" aria-label="Adam Hall Buy My Car — home">
              <img src="/assets/logos/logo-white.svg" alt="Adam Hall Buy My Car" width={170} height={70} />
            </Link>
            <p>{site.tagline}</p>
          </div>

          <div className="site-footer__col">
            <h6>Links</h6>
            <ul>
              {nav.map((item) =>
                // "Cars for Sale" crosses to the marketplace domain, so it is a
                // plain anchor rather than a router Link.
                item.external ? (
                  <li key={item.to}>
                    <a href={item.to}>{item.label}</a>
                  </li>
                ) : (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="site-footer__col">
            <h6>Social</h6>
            <ul>
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer noopener">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div className="site-footer__col">
            <h6>Contact Us</h6>
            <ul>
              <li>
                <a href={site.phoneHref}>
                  <span aria-hidden="true">☎</span> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <Link to="/buy-my-car">
                  <span aria-hidden="true">☺</span> Buy My Car
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="container container--wide site-footer__legal">
          <p>{site.copyright}</p>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </div>
      </footer>
    </>
  );
}
