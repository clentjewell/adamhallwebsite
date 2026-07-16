import { useEffect } from 'react';

interface Seo {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  robots?: string;
}

const ORIGIN = 'https://adamhallbuymycar.com.au';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Sets per-page document title and meta tags (title, description, canonical, OG, Twitter). */
export function useSeo({ title, description, path = '/', ogImage, robots }: Seo) {
  useEffect(() => {
    const canonical = ORIGIN + path;
    const img = ogImage || `${ORIGIN}/assets/images/Adam-Hall-4CRB-Gold-Coast.jpg`;
    document.title = title;
    if (description) setMeta('name', 'description', description);
    setLink('canonical', canonical);
    setMeta('name', 'robots', robots || 'index, follow, max-image-preview:large');

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:title', title);
    if (description) setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', img);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    if (description) setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
  }, [title, description, path, ogImage, robots]);
}
