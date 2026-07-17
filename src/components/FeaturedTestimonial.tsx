import { FeaturedQuote } from './Testimonials';
import './FeaturedTestimonial.css';

interface Props {
  photo: string;
  photoAlt: string;
  quote: string;
  name: string;
  role?: string;
  /** true = photo starts at the 1200px container edge (How It Works);
      false = near-viewport-edge composition (Home). */
  contained?: boolean;
}

/** Green featured-testimonial band: photo with the empty photo-frame.svg
    overlapping it, curly arrow, and a large quote with tan attribution. */
export default function FeaturedTestimonial({ photo, photoAlt, quote, name, role, contained = false }: Props) {
  return (
    <section className="bg-green ftest">
      <div className={`ftest__inner ${contained ? 'ftest__inner--contained' : 'container container--wide'}`}>
        <div className="ftest__media reveal-zoom">
          <img className="ftest__photo" src={photo} alt={photoAlt} loading="lazy" width={486} height={608} />
          <span className="ftest__frame" aria-hidden="true" />
          <img className="ftest__arrow" src="/assets/decor/curly-arrow.svg" alt="" aria-hidden="true" />
        </div>
        <div className="ftest__quote reveal-right">
          <FeaturedQuote quote={quote} name={name} role={role} />
        </div>
      </div>
    </section>
  );
}
