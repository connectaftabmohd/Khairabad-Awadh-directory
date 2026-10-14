import { CityListing } from '../types/directory';
import { KhairabadBlog } from '../data/khairabadBlogs';
import { getListingPrimaryImage } from './categoryImages';

export interface SocialShareData {
  listingId: string;
  name: string;
  category: string;
  locality: string;
  shareUrl: string;
  imageUrl: string;
  absoluteImageUrl: string;
  title: string;
  description: string;
  whatsappText: string;
  telegramText: string;
  twitterText: string;
  emailSubject: string;
  emailBody: string;
  smsText: string;
  pinterestDescription: string;
  links: {
    whatsapp: string;
    telegram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    pinterest: string;
    reddit: string;
    email: string;
    sms: string;
  };
}

/**
 * Compute fully optimized social sharing metadata, text, image, and deep-link for any listing.
 */
export function getListingShareData(listing: CityListing): SocialShareData {
  const isClient = typeof window !== 'undefined';
  const origin = isClient ? window.location.origin : 'https://khairabadcity.in';
  const pathname = isClient ? window.location.pathname : '/';
  
  // Clean canonical deep-link URL
  const shareUrl = `${origin}${pathname}?listing=${encodeURIComponent(listing.id)}`;
  
  // Resolve image URL
  const rawImage = getListingPrimaryImage(listing);
  const absoluteImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `${origin}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const categoryName = listing.subcategory || listing.category.replace(/-/g, ' ');
  const localityName = listing.locality || 'Khairabad, Sitapur';
  const cleanDescription = (listing.description || '').replace(/\s+/g, ' ').trim();
  const summarySnippet =
    cleanDescription.length > 140
      ? `${cleanDescription.substring(0, 137)}...`
      : cleanDescription || `Official listing for ${listing.name} on Khairabad City Directory.`;

  // 1. WhatsApp Formatted Text (Markdown bold/italics + emojis + full contact info)
  const whatsappLines: string[] = [
    `📍 *${listing.name}*`,
    `🏷️ _${categoryName.toUpperCase()}_ · *${localityName}*`,
    '',
    summarySnippet,
    '',
    listing.address ? `📌 *Address:* ${listing.address}` : '',
    listing.phone ? `📞 *Phone:* ${listing.phone}` : '',
    listing.openingHours ? `⏰ *Timings:* ${listing.openingHours}` : '',
    listing.rating ? `⭐️ *Rating:* ${listing.rating}/5 (${listing.reviews || 0} reviews)` : '',
    listing.priceRange ? `💰 *Price:* ${listing.priceRange}` : '',
    '',
    `🔗 *View Photos, Reviews & Directions on Khairabad City Directory:*`,
    shareUrl,
  ].filter(Boolean);

  const whatsappText = whatsappLines.join('\n');

  // 2. Telegram Text
  const telegramText = `📍 *${listing.name}* (${categoryName})\n${localityName}, Khairabad, UP (PIN 261131)\n\n${summarySnippet}\n\n${listing.phone ? `📞 Contact: ${listing.phone}\n` : ''}🔗 Explore on Khairabad Directory:\n${shareUrl}`;

  // 3. Twitter / X Text (Max 280 chars with tags)
  const twitterBase = `Discover "${listing.name}" (${categoryName}) in ${localityName}, Khairabad on Khairabad City Directory! 📍 #Khairabad #Sitapur #UP261131\n`;
  const twitterText = twitterBase;

  // 4. Email Subject & Body
  const emailSubject = `Local Directory: ${listing.name} in Khairabad (PIN 261131)`;
  const emailBody = `Hi,\n\nI wanted to share this place with you from the Khairabad City Directory:\n\n` +
    `• Name: ${listing.name}\n` +
    `• Category: ${categoryName}\n` +
    `• Locality: ${localityName}\n` +
    (listing.address ? `• Address: ${listing.address}\n` : '') +
    (listing.phone ? `• Phone: ${listing.phone}\n` : '') +
    (listing.openingHours ? `• Timings: ${listing.openingHours}\n` : '') +
    (listing.rating ? `• Rating: ${listing.rating}/5\n` : '') +
    `\nSummary:\n${cleanDescription}\n\n` +
    `View photos, full services, reviews & directions here:\n${shareUrl}\n\n` +
    `Khairabad City Directory & Local Guide`;

  // 5. SMS Text
  const smsText = `Check out ${listing.name} (${categoryName}) in ${localityName}, Khairabad: ${shareUrl}`;

  // 6. Pinterest Description
  const pinterestDescription = `${listing.name} – ${categoryName} in ${localityName}, Khairabad. Find contact, address, reviews & directions on Khairabad City Directory.`;

  // Pre-encoded URLs for instant social sharing
  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(telegramText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(absoluteImageUrl)}&description=${encodeURIComponent(pinterestDescription)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(`${listing.name} – ${categoryName} in Khairabad`)}`,
    email: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
    sms: `sms:?&body=${encodeURIComponent(smsText)}`,
  };

  return {
    listingId: listing.id,
    name: listing.name,
    category: categoryName,
    locality: localityName,
    shareUrl,
    imageUrl: rawImage,
    absoluteImageUrl,
    title: `${listing.name} – ${categoryName} in Khairabad, Sitapur (261131)`,
    description: summarySnippet,
    whatsappText,
    telegramText,
    twitterText,
    emailSubject,
    emailBody,
    smsText,
    pinterestDescription,
    links,
  };
}

/**
 * Compute fully optimized social sharing metadata, text, images, and deep-link for a Blog or News Article.
 */
export function getBlogShareData(blog: KhairabadBlog): SocialShareData {
  const isClient = typeof window !== 'undefined';
  const origin = isClient ? window.location.origin : 'https://khairabadcity.in';
  const pathname = isClient ? window.location.pathname : '/';
  
  // Clean canonical deep-link URL that opens this exact blog article
  const shareUrl = `${origin}${pathname}?view=blog&blog=${encodeURIComponent(blog.slug || blog.id)}`;
  
  // Resolve absolute image URL
  const rawImage = blog.image || '/images/khairabad_hero_banner_1791046903675.jpg';
  const absoluteImageUrl = rawImage.startsWith('http')
    ? rawImage
    : `${origin}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`;

  const cleanExcerpt = (blog.excerpt || '').replace(/\s+/g, ' ').trim();
  const summarySnippet =
    cleanExcerpt.length > 150
      ? `${cleanExcerpt.substring(0, 147)}...`
      : cleanExcerpt || `Official historical guide and town article on ${blog.title}.`;

  const topHighlights = (blog.keyHighlights || []).slice(0, 3);
  const locationLine = blog.visitorInfo?.location ? `📍 *Location:* ${blog.visitorInfo.location}` : '';

  // 1. WhatsApp Formatted Text
  const whatsappLines: string[] = [
    `📰 *${blog.title}*`,
    `🏷️ _${blog.category.toUpperCase()}_ · ⏱️ ${blog.readTime} · 📅 ${blog.publishDate}`,
    '',
    summarySnippet,
    '',
    locationLine,
    topHighlights.length > 0 ? `✨ *Key Highlights:*` : '',
    ...topHighlights.map((h) => `• ${h}`),
    '',
    `🔗 *Read Full Article & Visitor Guide on Khairabad Directory:*`,
    shareUrl,
  ].filter(Boolean);

  const whatsappText = whatsappLines.join('\n');

  // 2. Telegram Text
  const telegramText = `📰 *${blog.title}*\n${blog.category} · Khairabad, UP (PIN 261131)\n\n${summarySnippet}\n\n${blog.visitorInfo?.location ? `📍 Location: ${blog.visitorInfo.location}\n` : ''}🔗 Read complete article:\n${shareUrl}`;

  // 3. Twitter / X Text
  const titleSnippet = blog.title.length > 160 ? `${blog.title.substring(0, 157)}...` : blog.title;
  const twitterText = `Explore "${titleSnippet}" — Khairabad Heritage, History & News Guide 📍 #Khairabad #Sitapur #UP261131 #Awadh\n`;

  // 4. Email Subject & Body
  const emailSubject = `Khairabad Heritage & News: ${blog.title}`;
  const emailBody = `Hi,\n\nI wanted to share this fascinating article from the Khairabad City Guide & Heritage portal:\n\n` +
    `• Title: ${blog.title}\n` +
    `• Category: ${blog.category}\n` +
    `• Read Time: ${blog.readTime} (${blog.publishDate})\n` +
    (blog.visitorInfo?.location ? `• Location: ${blog.visitorInfo.location}\n` : '') +
    `\nSummary:\n${cleanExcerpt}\n\n` +
    `Read the full story, historical background & visiting information here:\n${shareUrl}\n\n` +
    `Khairabad City Directory & Heritage Archive`;

  // 5. SMS Text
  const smsText = `Read "${blog.title.substring(0, 80)}" on Khairabad Guide: ${shareUrl}`;

  // 6. Pinterest Description
  const pinterestDescription = `${blog.title} — ${cleanExcerpt.substring(0, 180)} | Khairabad Heritage & News Guide`;

  // Encode URL parameters for sharing links
  const encUrl = encodeURIComponent(shareUrl);
  const encWhatsappText = encodeURIComponent(whatsappText);
  const encTelegramText = encodeURIComponent(telegramText);
  const encTwitterText = encodeURIComponent(twitterText);
  const encTitle = encodeURIComponent(blog.title);
  const encSummary = encodeURIComponent(summarySnippet);
  const encEmailSubject = encodeURIComponent(emailSubject);
  const encEmailBody = encodeURIComponent(emailBody);
  const encSmsText = encodeURIComponent(smsText);

  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${encWhatsappText}`,
    telegram: `https://t.me/share/url?url=${encUrl}&text=${encTelegramText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTwitterText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encUrl}&media=${encodeURIComponent(absoluteImageUrl)}&description=${encodeURIComponent(pinterestDescription)}`,
    reddit: `https://reddit.com/submit?url=${encUrl}&title=${encTitle}`,
    email: `mailto:?subject=${encEmailSubject}&body=${encEmailBody}`,
    sms: `sms:?&body=${encSmsText}`,
  };

  return {
    listingId: blog.id,
    name: blog.title,
    category: blog.category,
    locality: blog.visitorInfo?.location || 'Khairabad, Sitapur',
    shareUrl,
    imageUrl: rawImage,
    absoluteImageUrl,
    title: `${blog.title} | Khairabad Heritage & News`,
    description: summarySnippet,
    whatsappText,
    telegramText,
    twitterText,
    emailSubject,
    emailBody,
    smsText,
    pinterestDescription,
    links,
  };
}

/**
 * Dynamically updates document <title> and OpenGraph / Twitter meta tags for a Blog Article.
 */
export function updateDocumentBlogSocialMeta(blog: KhairabadBlog): void {
  if (typeof document === 'undefined') return;

  const data = getBlogShareData(blog);

  // Update Page Title
  document.title = `${blog.title} | Khairabad Heritage & News`;

  const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
    const selector = isProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.content = value;
  };

  // Standard Meta
  setMeta('description', data.description);

  // OpenGraph (Facebook, WhatsApp, LinkedIn, Discord, Telegram)
  setMeta('og:type', 'article', true);
  setMeta('og:title', data.title, true);
  setMeta('og:description', data.description, true);
  setMeta('og:url', data.shareUrl, true);
  setMeta('og:image', data.absoluteImageUrl, true);
  setMeta('og:image:alt', `${blog.title} - Khairabad Heritage`, true);
  setMeta('og:site_name', 'Khairabad City Directory & Heritage Guide', true);

  // Twitter / X Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', data.title);
  setMeta('twitter:description', data.description);
  setMeta('twitter:image', data.absoluteImageUrl);

  // Update or inject Schema.org JSON-LD Structured Data
  try {
    const existingScript = document.getElementById('listing-json-ld');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'listing-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      image: data.absoluteImageUrl,
      url: data.shareUrl,
      description: data.description,
      datePublished: blog.publishDate,
      author: {
        '@type': 'Organization',
        name: blog.author || 'Khairabad Editorial Desk',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Khairabad City Directory',
        logo: {
          '@type': 'ImageObject',
          url: `${window.location.origin}/images/khairabad_hero_og.jpg`,
        },
      },
    });
    document.head.appendChild(script);
  } catch {
    // Ignore JSON-LD failure
  }
}

/**
 * Dynamically updates document <title> and OpenGraph / Twitter meta tags
 * for real-time web crawlers, messaging previews, and user bookmarks.
 */
export function updateDocumentSocialMeta(listing: CityListing): void {
  if (typeof document === 'undefined') return;

  const data = getListingShareData(listing);

  // Update Page Title
  document.title = `${listing.name} | Khairabad City Directory`;

  const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
    const selector = isProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.content = value;
  };

  // Standard Meta
  setMeta('description', data.description);

  // OpenGraph (Facebook, WhatsApp, LinkedIn, Discord, Telegram)
  setMeta('og:type', 'business.business', true);
  setMeta('og:title', data.title, true);
  setMeta('og:description', data.description, true);
  setMeta('og:url', data.shareUrl, true);
  setMeta('og:image', data.absoluteImageUrl, true);
  setMeta('og:image:alt', `${listing.name} in Khairabad`, true);
  setMeta('og:site_name', 'Khairabad City Directory', true);

  // Twitter / X Card
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', data.title);
  setMeta('twitter:description', data.description);
  setMeta('twitter:image', data.absoluteImageUrl);

  // Update or inject Schema.org JSON-LD Structured Data
  try {
    const existingScript = document.getElementById('listing-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'listing-json-ld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: listing.name,
      image: data.absoluteImageUrl,
      url: data.shareUrl,
      telephone: listing.phone || undefined,
      description: data.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: listing.address || listing.locality,
        addressLocality: 'Khairabad',
        addressRegion: 'Uttar Pradesh',
        postalCode: '261131',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '27.5319',
        longitude: '80.7554',
      },
      aggregateRating: listing.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: listing.rating,
            reviewCount: listing.reviews || 1,
          }
        : undefined,
    });
    document.head.appendChild(script);
  } catch {
    // Ignore JSON-LD injection failure
  }
}

/**
 * Restores baseline social meta tags when closing modal or navigating back to directory.
 */
export function restoreDefaultSocialMeta(): void {
  if (typeof document === 'undefined') return;

  document.title = 'Khairabad City Directory & Local Business Guide | Sitapur, UP (PIN 261131)';

  const setMeta = (nameOrProperty: string, value: string, isProperty = false) => {
    const selector = isProperty
      ? `meta[property="${nameOrProperty}"]`
      : `meta[name="${nameOrProperty}"]`;
    const element = document.querySelector(selector) as HTMLMetaElement | null;
    if (element) {
      element.content = value;
    }
  };

  const defaultDesc =
    'Official Khairabad digital guide & local business directory: find top hospitals, doctors, schools, marriage lawns, emergency helplines, shops & historic Awadh heritage in Sitapur (PIN 261131).';
  const defaultImage = `${window.location.origin}/images/khairabad_hero_og.jpg`;

  setMeta('description', defaultDesc);
  setMeta('og:type', 'website', true);
  setMeta('og:title', 'Khairabad City Directory & Local Business Guide | Sitapur, UP (PIN 261131)', true);
  setMeta('og:description', defaultDesc, true);
  setMeta('og:url', window.location.origin, true);
  setMeta('og:image', defaultImage, true);

  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', 'Khairabad City Directory & Local Business Guide | Sitapur, UP (PIN 261131)');
  setMeta('twitter:description', defaultDesc);
  setMeta('twitter:image', defaultImage);

  const existingScript = document.getElementById('listing-json-ld');
  if (existingScript) existingScript.remove();
}
