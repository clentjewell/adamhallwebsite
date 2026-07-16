import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';
import ValuationForm from '../components/ValuationForm';
import IconList from '../components/IconList';
import { TestimonialList } from '../components/Testimonials';
import { buyMyCarTestimonials } from '../data/testimonials';
import { site } from '../data/site';
import './BuyMyCar.css';

export default function BuyMyCar() {
  useSeo({
    title: "Adam Hall Value My Car | What's My Car Worth?",
    description:
      'Up-to-the-minute market pricing and decades of experience to help you set the right price for your car. Get a free, obligation-free valuation from Adam Hall.',
    path: '/buy-my-car',
  });

  return (
    <div className="bmc">
      <header className="bmc__top container container--wide">
        <Link to="/" className="bmc__logo" aria-label="Adam Hall Buy My Car — home">
          <img src="/assets/logos/logo-black.svg" alt="Adam Hall Buy My Car" width={200} height={90} />
        </Link>
        <div className="bmc__featured">
          <span>Featured On</span>
          <img src="/assets/logos/4crb-white.png" alt="4CRB 89.3FM" width={110} height={55} />
        </div>
      </header>

      <div className="bmc__body container container--wide">
        <div className="bmc__intro">
          <h1 className="bmc__title">
            <span className="wavy">Buy</span> my car.
          </h1>
          <p className="bmc__lead">
            Up-to-the-minute market pricing and decades of experience to help you set the right price
            for your car.
          </p>
          <IconList
            items={[
              'Known & trusted by the 4CRB 89.3FM Community',
              'Obligation-free, expert valuation',
              'Real market pricing at your doorstep',
              'Peace of mind',
              'Hassle-free guarantee',
            ]}
          />
          <hr className="bmc__rule" />
          <TestimonialList items={buyMyCarTestimonials} />
          <p className="bmc__phone">
            Prefer to chat? Call Adam on{' '}
            <a href={site.phoneHref}>{site.phoneDisplay}</a>
          </p>
        </div>

        <div className="bmc__form" id="valuation">
          <ValuationForm />
        </div>
      </div>

      <footer className="bmc__foot container container--wide">
        <p>{site.copyright}</p>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </footer>
    </div>
  );
}
