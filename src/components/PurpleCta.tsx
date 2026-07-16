import Button from './Button';
import './PurpleCta.css';

/** Purple call-to-action band shown near the bottom of every main page. */
export default function PurpleCta() {
  return (
    <section className="pcta bg-purple" aria-label="Get started">
      <div className="container">
        <div className="pcta__inner reveal">
          <h4 className="pcta__title">
            Time&rsquo;s precious and life&rsquo;s busy
            <span>Put your feet up and let Adam do all the leg work.</span>
          </h4>
          <div className="pcta__action">
            <span className="pcta__start">Start with</span>
            <img className="pcta__arrow" src="/assets/decor/curly-arrow.svg" alt="" aria-hidden="true" />
            <Button to="/buy-my-car" variant="green">
              Buy My Car
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
