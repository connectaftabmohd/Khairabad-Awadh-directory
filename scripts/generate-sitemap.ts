import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_LISTINGS, CATEGORIES, LOCALITIES } from '../src/data/khairabadData.ts';
import { KHAIRABAD_BLOGS } from '../src/data/khairabadBlogs.ts';
import { CHAURAHA_HUBS } from '../src/data/roadsConnectivityData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://khairabadcity.in';
const TODAY = '2026-10-16';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  comment?: string;
}

const urls: SitemapUrl[] = [];

// 1. Core Pages
const corePages = [
  { path: '/', priority: 1.0, changefreq: 'daily' as const, comment: 'Home Page' },
  { path: '/?tab=directory', priority: 0.9, changefreq: 'daily' as const, comment: 'City Directory' },
  { path: '/?tab=blog', priority: 0.9, changefreq: 'daily' as const, comment: 'Khairabad Heritage Blog & News' },
  { path: '/?tab=weather', priority: 0.8, changefreq: 'hourly' as const, comment: 'Live Weather Forecast' },
  { path: '/?tab=about', priority: 0.8, changefreq: 'weekly' as const, comment: 'About Khairabad' },
  { path: '/?tab=privacy', priority: 0.5, changefreq: 'monthly' as const, comment: 'Privacy Policy' },
  { path: '/?tab=terms', priority: 0.5, changefreq: 'monthly' as const, comment: 'Terms of Service' },
];

for (const page of corePages) {
  urls.push({
    loc: `${BASE_URL}${page.path}`,
    lastmod: TODAY,
    changefreq: page.changefreq,
    priority: page.priority,
    comment: page.comment,
  });
}

// 2. Directory Categories
for (const cat of CATEGORIES) {
  urls.push({
    loc: `${BASE_URL}/?category=${encodeURIComponent(cat.id)}`,
    lastmod: TODAY,
    changefreq: 'daily',
    priority: 0.85,
    comment: `Category: ${cat.label}`,
  });
}

// 3. Editorial & Heritage Blog Posts
for (const blog of KHAIRABAD_BLOGS) {
  urls.push({
    loc: `${BASE_URL}/?blog=${encodeURIComponent(blog.slug)}`,
    lastmod: blog.publishDate || TODAY,
    changefreq: 'weekly',
    priority: 0.8,
    comment: `Blog: ${blog.title}`,
  });
}

// 4. Dynamic Business, School, Hospital, Religious & Civic Listings
for (const listing of INITIAL_LISTINGS) {
  urls.push({
    loc: `${BASE_URL}/?listing=${encodeURIComponent(listing.id)}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: listing.verified ? 0.75 : 0.7,
    comment: `${listing.category.toUpperCase()}: ${listing.name}`,
  });
}

// 5. Transit Hubs & Chaurahas

for (const hub of CHAURAHA_HUBS) {
  urls.push({
    loc: `${BASE_URL}/?chauraha=${encodeURIComponent(hub.id)}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: 0.65,
    comment: `Chauraha: ${hub.name}`,
  });
}

// 6. Localities & Mohallas
for (const loc of LOCALITIES) {
  urls.push({
    loc: `${BASE_URL}/?locality=${encodeURIComponent(loc.id)}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: 0.6,
    comment: `Locality: ${loc.name}`,
  });
}

// Build XML
const xmlLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
];

let currentSection = '';

for (const item of urls) {
  // XML Escape special characters in URL
  const safeLoc = item.loc
    .replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  if (item.comment && item.comment !== currentSection) {
    const cleanComment = item.comment
      .replace(/--/g, '__')
      .replace(/&/g, 'and');
    xmlLines.push(`  <!-- ${cleanComment} -->`);
    currentSection = item.comment;
  }
  
  xmlLines.push('  <url>');
  xmlLines.push(`    <loc>${safeLoc}</loc>`);
  xmlLines.push(`    <lastmod>${item.lastmod}</lastmod>`);
  xmlLines.push(`    <changefreq>${item.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${item.priority.toFixed(2)}</priority>`);
  xmlLines.push('  </url>');
}

xmlLines.push('</urlset>');
xmlLines.push('');

const outputFilePath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(outputFilePath, xmlLines.join('\n'), 'utf8');

console.log(`Successfully generated sitemap with ${urls.length} URLs at ${outputFilePath}`);
