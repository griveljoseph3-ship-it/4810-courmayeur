import type { APIRoute } from 'astro';
import { ROUTES, LOCALES, HTML_LANG, absolute, type PageKey } from '../lib/routes';
import { site } from '../lib/data';

export const GET: APIRoute = () => {
  const SITE = site.brand.siteUrl;
  const today = new Date().toISOString().slice(0, 10);
  const urls = (Object.keys(ROUTES) as PageKey[]).flatMap((key) =>
    LOCALES.map((lang) => {
      const alts = LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l].slice(0, 2)}" href="${absolute(key, l, SITE)}"/>`).join('\n');
      return `  <url>\n    <loc>${absolute(key, lang, SITE)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(key, 'it', SITE)}"/>\n  </url>`;
    }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
