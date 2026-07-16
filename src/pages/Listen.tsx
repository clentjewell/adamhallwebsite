import { useState } from 'react';
import { useSeo } from '../lib/seo';
import { useReveal } from '../hooks/useReveal';
import GreenHero from '../components/GreenHero';
import AudioPlayer from '../components/AudioPlayer';
import FaqSection from '../components/FaqSection';
import PurpleCta from '../components/PurpleCta';
import { episodes } from '../data/episodes';
import './Listen.css';

const PAGE_SIZE = 10;

export default function Listen() {
  useSeo({
    title: "What's Your Car Worth - Podcast | Adam Hall Buy My Car",
    description:
      "Listen to Adam Hall's ‘What's Your Car Worth’ segment on 4CRB 89.3FM — up-to-the-minute market pricing and expert car-buying advice, live on air.",
    path: '/listen-whats-your-car-worth',
  });
  const [shown, setShown] = useState(PAGE_SIZE);
  useReveal([shown]);
  const visible = episodes.slice(0, shown);

  return (
    <>
      <GreenHero
        title={
          <>
            What&rsquo;s You <span className="wavy">Car Worth</span>
          </>
        }
        subtitle="Adam Hall has been serving the community for almost three decades."
      />

      <section className="section bg-cream">
        <div className="container container--wide listen">
          <div className="listen__side">
            <h3 className="listen__title reveal-left">
              Latest <span className="wavy">Programs</span>
            </h3>
          </div>
          <div className="listen__main">
            <div className="listen__list">
              {visible.map((ep) => (
                <AudioPlayer key={ep.id} episode={ep} />
              ))}
            </div>
            {shown < episodes.length && (
              <div className="listen__more">
                <button
                  type="button"
                  className="btn btn--green"
                  onClick={() => setShown((s) => Math.min(s + PAGE_SIZE, episodes.length))}
                >
                  Load more programs
                </button>
                <p className="listen__count">
                  Showing {visible.length} of {episodes.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <FaqSection />
      <PurpleCta />
    </>
  );
}
