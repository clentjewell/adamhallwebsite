import { useSeo } from '../lib/seo';
import { useReveal } from '../hooks/useReveal';
import FaqSection from '../components/FaqSection';
import PurpleCta from '../components/PurpleCta';
import ContactForm from '../components/ContactForm';
import { site } from '../data/site';
import './Contact.css';

export default function Contact() {
  useSeo({
    title: 'Contact Adam Hall',
    description:
      'Get in touch with Adam Hall for a free, obligation-free car valuation. Servicing the Gold Coast, Brisbane & Northern Rivers. Call 0404 290 617.',
    path: '/contact-us',
  });
  useReveal();

  return (
    <>
      <section className="bg-green contact-hero">
        <div className="container container--wide contact-hero__inner">
          <div className="contact-hero__content">
            <h1 className="contact-hero__title">Got Questions?</h1>
            <p className="contact-hero__subtitle">
              I&rsquo;m here to help. Give me a call or fill in the form below and I will get back
              to you asap.
            </p>
            <a className="contact-hero__phone" href={site.phoneHref}>
              <span aria-hidden="true">☎</span> {site.phoneDisplay}
            </a>
          </div>
          <div className="contact-hero__form">
            <ContactForm />
          </div>
        </div>
      </section>

      <FaqSection />
      <PurpleCta />
    </>
  );
}
