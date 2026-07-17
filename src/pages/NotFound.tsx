import { useSeo } from '../lib/seo';
import Button from '../components/Button';
import { site } from '../data/site';
import './NotFound.css';

export default function NotFound() {
  useSeo({
    title: 'Page not found | Adam Hall Buy My Car',
    description: 'The page you were looking for could not be found.',
    robots: 'noindex, follow',
  });

  return (
    <section className="nf">
      <div className="nf__band bg-green" aria-hidden="true" />
      <div className="container container--narrow nf__inner section">
        <p className="nf__code">404</p>
        <h1>We couldn&rsquo;t find that page</h1>
        <p className="nf__text">
          The page you were looking for may have moved or no longer exists. Let&rsquo;s get you back
          on the road.
        </p>
        <div className="nf__actions">
          <Button to="/" variant="green">
            Back to Home
          </Button>
          <Button href={site.phoneHref} variant="outline-green">
            Call Adam {site.phoneDisplay}
          </Button>
        </div>
      </div>
    </section>
  );
}
