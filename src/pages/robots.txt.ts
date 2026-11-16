import type { APIRoute } from 'astro';
import { site } from '../lib/data';
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.brand.siteUrl}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
