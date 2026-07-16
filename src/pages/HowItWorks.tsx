import { useSeo } from '../lib/seo';
import { useReveal } from '../hooks/useReveal';
import GreenHero from '../components/GreenHero';
import Accordion from '../components/Accordion';
import { TestimonialList, FeaturedQuote } from '../components/Testimonials';
import IconList from '../components/IconList';
import TrustBar from '../components/TrustBar';
import FaqSection from '../components/FaqSection';
import PurpleCta from '../components/PurpleCta';
import Button from '../components/Button';
import WaveDivider from '../components/WaveDivider';
import { steps } from '../data/steps';
import { namedTestimonials, heroQuote } from '../data/testimonials';
import './HowItWorks.css';

const promiseCards = [
  {
    title: 'Personal',
    body: 'Friendly and pressure free, Adam treats you like family. No dealing with salespeople or tyre-kickers.',
  },
  {
    title: 'Simple',
    body: 'The whole process is taken care of for you, from your obligation-free, expert valuation, all the paperwork, the money in your pocket and car pick-up.',
  },
  {
    title: 'Fast',
    body: 'If you are comfortable to proceed to sell your car, Adam will organise to transfer payment. Once your money is in your account, he will organise to collect your car from you.',
  },
  { title: 'Easy', body: 'From start to finish.' },
  {
    title: 'Hassle-free',
    body: "Adam's promise is to take the hassle, stress and pressure out of selling your car.",
  },
];

export default function HowItWorks() {
  useSeo({
    title: 'Adam Hall Value My Car | How it Works',
    description:
      'We come to you, provide an instant offer for your car and can provide payment and collection within 24 hours. See how selling your car to Adam Hall works.',
    path: '/how-it-works',
  });
  useReveal();

  return (
    <>
      <GreenHero
        title={
          <>
            Let Adam buy your car <span className="wavy">hassle free</span>
          </>
        }
        subtitle="Industry leading market knowledge, safe and secure payment."
        bridgeImage="/assets/images/Adam-Hall-Car-Buying-Gold-Coast-3.jpg"
        bridgeAlt="Adam Hall handing paperwork to a customer through their car window"
      />

      {/* Friendly, convenient and fast */}
      <section className="section bg-white hiw-lead" style={{ paddingTop: 0 }}>
        <div className="container container--narrow reveal">
          <h2 className="hiw-lead__title">
            Friendly, <span className="wavy">convenient</span> and fast
          </h2>
          <p className="hiw-lead__text">
            We come to you, provide an instant offer for your car and can provide payment and
            collection within 24 hours.
          </p>
        </div>
      </section>

      {/* How it works steps — accordion left, photo right */}
      <section className="section bg-cream">
        <div className="container container--wide hiw-steps">
          <div className="hiw-steps__content reveal">
            <h3 className="hiw-steps__title">
              How it <span className="wavy">works</span>
            </h3>
            <Accordion items={steps} />
          </div>
          <div className="hiw-steps__media reveal">
            <img
              src="/assets/images/Adam-Hall-Value-My-Car-3.jpg"
              alt="Adam Hall inspecting a car's engine bay"
              loading="lazy"
              width={560}
              height={620}
            />
            <img
              className="hiw-steps__overlay"
              src="/assets/decor/expert-valuation.svg"
              alt=""
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Mid-page CTA line */}
      <section className="bg-cream hiw-band">
        <div className="container container--narrow reveal">
          <h4 className="hiw-band__title">
            Time&rsquo;s precious and <span className="hiw-band__pill">life&rsquo;s busy</span>
            <span className="hiw-band__line">
              Let Adam <span className="wavy">take the hassle out</span> of selling your car.
            </span>
          </h4>
          <Button to="/buy-my-car" variant="purple" arrow>
            Adam, Buy My Car
          </Button>
        </div>
      </section>

      {/* Happy customers */}
      <section className="section bg-white">
        <div className="container container--narrow">
          <h3 className="hiw-heading reveal">Happy Customers</h3>
          <TestimonialList items={namedTestimonials} />
        </div>
      </section>

      {/* Does the thought sound exhausting */}
      <section className="section bg-white hiw-exhaust-wrap" style={{ paddingTop: 0 }}>
        <div className="container container--wide hiw-exhaust">
          <div className="hiw-exhaust__media reveal">
            <img
              src="/assets/decor/thankyou-welcome.svg"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={480}
              height={300}
            />
          </div>
          <div className="hiw-exhaust__content reveal">
            <h3>Does the thought of selling your car sound exhausting?</h3>
            <p>
              Don&rsquo;t lose sleep trying to work out how best to sell your car. With a simple
              phone call, we can help take the stress out of the process.
            </p>
            <IconList
              items={["It's highly personal", 'Super simple', 'Fast', 'Easy', 'Hassle-free, guarantee']}
            />
            <div className="hiw-exhaust__actions">
              <Button to="/buy-my-car" variant="purple" arrow>
                Buy My Car
              </Button>
            </div>
          </div>
        </div>

        {/* Adam's promise cards */}
        <div className="container container--wide hiw-promise">
          {promiseCards.map((c) => (
            <div className="hiw-promise__card reveal" key={c.title}>
              <h5>{c.title}</h5>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBar />

      <WaveDivider color="green" />
      <section className="bg-green hiw-quote">
        <div className="container container--narrow reveal">
          <FeaturedQuote
            quote={heroQuote.howItWorks.quote}
            name={heroQuote.howItWorks.name}
            role={heroQuote.howItWorks.role}
          />
        </div>
      </section>
      <WaveDivider color="green" flip />

      <FaqSection />
      <PurpleCta />
    </>
  );
}
