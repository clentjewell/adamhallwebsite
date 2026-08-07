import { useSeo } from '../lib/seo';
import { useReveal } from '../hooks/useReveal';
import IconList from '../components/IconList';
import Button from '../components/Button';
import HeroFilm from '../components/HeroFilm';
import WaveDivider from '../components/WaveDivider';
import { marketplaceUrl } from '../data/site';
// Reuse the home page's hero and split-section layout so the crossing page
// matches the rest of the site; CarsForSale.css only adds what is new here.
import './Home.css';
import './CarsForSale.css';

/*
 * The buy-side landing page on Adam's own site. Its one job is to send buyers
 * across to Car Marketplace, the sub-brand on its own domain. It is the
 * reciprocal of the footer band over there that sends sellers back to Adam.
 *
 * Voice follows the Car Marketplace identity: Australian English, no
 * exclamation marks, no em dashes, sentence case headings, one idea per block.
 * The stock is the hero, not Adam. His name is the endorsement, quoted as his
 * own credential rather than borrowed by the marketplace.
 */

const steps = [
  {
    n: '1',
    title: 'Find it',
    body: 'A short, hand-picked range, not eight thousand listings. Everything we know about each car is on the listing.',
  },
  {
    n: '2',
    title: 'Call about it',
    body: 'One number, one person. Ask anything. We will hold a car while you think it over.',
  },
  {
    n: '3',
    title: 'Drive it',
    body: 'Take it out properly, not around the block. Bring a mechanic along if you want one.',
  },
  {
    n: '4',
    title: 'Take it home',
    body: 'Paperwork done here, registration transferred, and Adam’s guarantee behind it.',
  },
];

export default function CarsForSale() {
  useSeo({
    title: 'Cars for Sale | Car Marketplace by Adam Hall',
    description:
      'Hand-picked used cars across the Gold Coast, Brisbane and Northern Rivers, every one PPSR checked and honestly described. Browse the cars Adam decided were worth buying.',
    path: '/cars-for-sale',
  });
  useReveal();

  return (
    <>
      {/* Hero: the film runs full width with the copy sitting over it.
          This page departs from the site's photo-left/content-right hero on
          purpose. The film is a side elevation, so it only reads whole in a
          wide frame; dropped into the usual 39% photo column it crops to a
          slab of door with no front or rear. The copy sits high and left
          because the car occupies the lower half of every frame. */}
      <section className="cfs-hero bg-green">
        <div className="cfs-hero__media">
          <HeroFilm
            className="cfs-hero__film"
            webm="/assets/video/Car-Marketplace-Blueprint-To-Road.webm"
            mp4="/assets/video/Car-Marketplace-Blueprint-To-Road.mp4"
            poster="/assets/images/Car-Marketplace-Blueprint-Poster.jpg"
            still="/assets/images/Car-Marketplace-Blueprint-Still.jpg"
            alt="A blueprint of a family wagon filling in to become a real car, which pulls forward and stops"
          />
        </div>
        <div className="cfs-hero__content">
          <span className="eyebrow eyebrow--hero">Car Marketplace by Adam Hall</span>
          <h1 className="cfs-hero__title">
            Cars worth putting <span className="wavy">our name</span> on
          </h1>
          <p className="cfs-hero__subtitle">
            A short range of used cars, every one hand-picked, PPSR checked and honestly
            described. If there is a mark on it, we say so.
          </p>
          <div className="hero__actions">
            <Button href={marketplaceUrl} variant="tan" arrow>
              Browse the cars
            </Button>
            <a className="cfs-hero__link" href="#how-buying-works">
              See how buying works
            </a>
          </div>
        </div>
      </section>

      {/* Positioning: the two words that separate this from a classifieds feed. */}
      <section className="section bg-cream cfs-intro">
        <div className="container container--narrow reveal">
          <span className="eyebrow">Curated, not classified</span>
          <h2 className="cfs-intro__title">
            We have already done the <span className="wavy">sorting</span>
          </h2>
          <p className="cfs-intro__text">
            The cars here move quickly, and the ones on the site are
            the ones that made the cut. No night on the classifieds, no Saturday spent driving to
            look at cars that were not as described.
          </p>
        </div>
      </section>

      {/* Why buy here: three value props, image beside them. */}
      <section className="section bg-cream" style={{ paddingTop: 0 }}>
        <div className="container container--wide home-split">
          <div className="home-split__content reveal-left">
            <span className="eyebrow">Why buy here</span>
            <h3 className="home-split__title">
              A used car without the <span className="wavy">yard</span>
            </h3>
            <p>
              The stock and the judgement behind it come from a working dealer, not an algorithm
              and not a page of strangers.
            </p>
            <IconList
              items={[
                'Hand-picked: a short range we would stand behind',
                'Honest: every car PPSR checked, every mark named',
                'Local and answerable: a real person on the end of the phone',
              ]}
            />
            <div className="home-actions">
              <Button href={marketplaceUrl} variant="tan" arrow>
                Browse the cars
              </Button>
            </div>
          </div>
          <div className="home-split__media reveal-right">
            <img
              src="/assets/images/Adam-Hall-Value-My-Car.jpg"
              alt="Adam Hall talking a buyer through a car"
              loading="lazy"
              width={640}
              height={480}
            />
          </div>
        </div>
      </section>

      <WaveDivider color="green" />

      {/* How buying works: the four-step process from the identity. Green so
          the green wave dividers above and below read as its curved edges,
          rather than floating bands between two cream sections. White cards. */}
      <section id="how-buying-works" className="section bg-green cfs-steps-section">
        <div className="container container--wide">
          <div className="cfs-steps__head reveal">
            <span className="eyebrow">How buying works</span>
            <h2 className="cfs-steps__title">Four steps, no pressure</h2>
          </div>
          <ol className="cfs-steps">
            {steps.map((s) => (
              <li key={s.n} className="cfs-step reveal">
                <span className="cfs-step__num" aria-hidden="true">
                  {s.n}
                </span>
                <h3 className="cfs-step__title">{s.title}</h3>
                <p className="cfs-step__body">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <WaveDivider color="green" flip />

      {/* Backed by Adam: the endorsement, quoted as his credential. Uses the
          media-left variant so the photo takes the left column and bleeds left,
          rather than the default right bleed which would overrun the text. */}
      <section className="section bg-cream cfs-backed">
        <div className="container container--wide home-split home-split--media-left">
          <div className="home-split__media reveal-left">
            <img
              src="/assets/images/Adam-Hall-4CRB-Gold-Coast.jpg"
              alt="Adam Hall on air at 4CRB 89.3FM"
              loading="lazy"
              width={640}
              height={430}
            />
          </div>
          <div className="home-split__content reveal-right">
            <span className="eyebrow">Backed by Adam</span>
            <h3 className="home-split__title">
              Every car is one Adam decided was worth <span className="wavy">buying</span>
            </h3>
            <p>
              Twenty-seven years in the trade, and more than 10,000 cars valued live on air on
              4CRB 89.3FM. That judgement is the whole point of the range.
            </p>
            <IconList
              items={[
                '27+ years buying and selling cars',
                '10,000 valuations live on 4CRB 89.3FM',
                'His name on the stock, and his guarantee behind it',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Final crossing: the one thing this page is for. */}
      <section className="cfs-cta">
        <div className="container container--narrow">
          <h2 className="cfs-cta__title">See the cars we currently have</h2>
          <p className="cfs-cta__text">
            Have a look at the range. No account, no sign-up, just the cars.
          </p>
          <Button href={marketplaceUrl} variant="tan" arrow>
            Browse the cars
          </Button>
          <p className="cfs-cta__aside">
            Car Marketplace is Adam&rsquo;s buy-side site, the same name behind Buy My
            Car. Every car is PPSR checked and honestly described.
          </p>
        </div>
      </section>
    </>
  );
}
