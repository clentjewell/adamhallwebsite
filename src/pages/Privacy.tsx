import { useSeo } from '../lib/seo';
import { useReveal } from '../hooks/useReveal';
import { privacyBlocks } from '../data/privacy';
import './Privacy.css';

export default function Privacy() {
  useSeo({
    title: 'Privacy Policy | Adam Hall Buy My Car',
    description:
      'Adam Hall Buy My Car privacy policy — how we collect, use, disclose, store and protect your personal information.',
    path: '/privacy-policy',
  });
  useReveal();

  return (
    <>
      <section className="bg-green privacy-hero">
        <div className="container container--narrow">
          <h1>Privacy Policy</h1>
        </div>
      </section>

      <section className="section bg-cream">
        <article className="container container--narrow privacy-body reveal">
          {privacyBlocks.map((b, i) =>
            b.type === 'h' ? <h2 key={i}>{b.text}</h2> : <p key={i}>{b.text}</p>
          )}
        </article>
      </section>
    </>
  );
}
