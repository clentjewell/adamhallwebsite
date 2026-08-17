/* ------------------------------------------------------------------
   Central site configuration & shared content.
   Edit values here to update contact details, nav, trust items, etc.
   ------------------------------------------------------------------ */

export const site = {
  name: 'Adam Hall Buy My Car',
  domain: 'adamhallbuymycar.com.au',
  phoneDisplay: '0404 290 617',
  phoneHref: 'tel:0404290617',
  tagline:
    'The easiest, fastest and safest way to sell your car in the Gold Coast, Brisbane and Northern Rivers',
  serviceAreas: 'Gold Coast, Brisbane & Northern Rivers',
  linkedin: 'https://www.linkedin.com/',
  copyright: `© ${new Date().getFullYear()} adamhallbuymycar.com.au. All Rights Reserved.`,
};

/*
 * The buy side. Car Marketplace by Adam Hall lives on its own domain; this is
 * the one place the parent site points buyers across to it. The "Cars for Sale"
 * nav item below reads from here and sends buyers straight over. There used to
 * be a /cars-for-sale landing page in between; it was removed, so the crossing
 * is now a single hop.
 *
 * SWAP AT LAUNCH: set this to https://carmarketplace.com.au once DNS is live.
 * It currently points at the deployed preview so the link is clickable for
 * review before the domain is switched on.
 */
export const marketplaceUrl =
  'https://claude-carmarketplace-domain-split-vgokd1-adamhall-marketplace.clent.workers.dev';

/*
 * `to` is a router path unless the item is marked external, in which case it is
 * an absolute URL and Header/Footer render a plain <a> rather than a NavLink.
 */
export type NavItem = { label: string; to: string; external?: boolean };

export const nav: NavItem[] = [
  { label: 'How it Works', to: '/how-it-works' },
  { label: 'Buy My Car', to: '/buy-my-car' },
  { label: "Adam's Story", to: '/about-adam-hall' },
  { label: 'Listen', to: '/listen-whats-your-car-worth' },
  { label: 'Contact', to: '/contact-us' },
  // The crossing to the buy side, as the last item. The reciprocal of the
  // footer band on the marketplace that sends sellers back here. It goes
  // straight to the other domain now that the /cars-for-sale page is gone.
  { label: 'Cars for Sale', to: marketplaceUrl, external: true },
];

/* Five-item trust bar shown on green hero sections */
export const trustBar = [
  { icon: '/assets/icons/icon-5-star.svg', label: '5 Star Reviews' },
  { icon: '/assets/icons/icon-hassle-free.svg', label: 'Hassle-free Guarantee' },
  { icon: '/assets/icons/icon-shield.svg', label: 'Real Market Pricing' },
  { icon: '/assets/icons/icon-27.svg', label: 'Over 27 Years Experience' },
  { icon: '/assets/icons/icon-stop-watch.svg', label: 'Same Day Payment' },
];

/* Three-item strip shown in the black pre-footer band */
export const preFooterTrust = [
  '1K+ Happy Customers',
  'Up-to-the-minute Market Pricing',
  'Hassle-free Guarantee',
];
