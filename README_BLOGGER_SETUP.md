# Khairabad City Directory – Blogger.com Setup & Deployment Guide

This document contains step-by-step technical instructions for deploying the **Khairabad City Directory** onto **Blogger.com** (Blogspot) without requiring external servers or paid hosting.

---

## 1. How to Backup an Existing Blogger Theme

1. Log into your Google account and navigate to [Blogger.com](https://www.blogger.com).
2. Select your blog from the top-left blog dropdown (or click **"New Blog"** to create `khairabadcity.blogspot.com`).
3. In the left navigation menu, click **Theme**.
4. Next to the orange **CUSTOMIZE** button, click the small downward arrow (dropdown menu).
5. Click **Backup**.
6. Click **DOWNLOAD**. Save the `.xml` file to your computer.

---

## 2. How to Install the Khairabad City Theme

1. In the same dropdown menu next to **CUSTOMIZE**, click **Restore**.
2. Click **UPLOAD**.
3. Select the `blogger-theme.xml` file generated in this repository (or copy its full contents).
4. *Alternative method:*
   - Click the dropdown menu next to **CUSTOMIZE** -> **Edit HTML**.
   - Press `Ctrl + A` (or `Cmd + A` on Mac) to select all existing code.
   - Press `Backspace` to delete everything.
   - Paste the complete code from `blogger-theme.xml`.
   - Click the **Save** icon (floppy disk) in the top-right corner.
5. Visit your blog URL (e.g. `https://yourblog.blogspot.com`) to confirm that the modern mobile-first directory is rendering.

---

## 3. Where to Update the Database

The directory database is self-contained directly inside the theme within the `<script>` tag:

```javascript
var KHAIRABAD_DATA = {
  categories: [...],
  emergencies: [...],
  listings: [...]
};
```

You can also host the separate `khairabad-database.js` on GitHub Pages, jsDelivr CDN, or Google Drive and link it via:
```html
<script src="https://your-domain.com/khairabad-database.js"></script>
```

---

## 4. How to Add a New Business Listing

To add a verified or new local business in Khairabad, locate `KHAIRABAD_DATA.listings` in the Blogger HTML editor and append a new JSON object:

```javascript
{
  id: "kh-biz-024",
  name: "New Khairabad Business Name",
  category: "restaurants", // matches category id: 'hospitals', 'marriage-lawns', 'restaurants', 'schools', etc.
  locality: "Sitapur Road", // e.g., 'Sitapur Road', 'Main Bazaar / Sabzi Mandi', 'Railway Station Road', 'Chungi Naka', etc.
  address: "Shop 12, Main Market, Khairabad, UP 261131",
  phone: "05862-25XXXX",
  whatsapp: "9198XXXXXXXX",
  hours: "9:00 AM – 8:30 PM",
  desc: "Detailed description of services offered in Khairabad.",
  verified: true, // set to true once phone and location are confirmed
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Business+Name+Khairabad+Sitapur"
}
```

---

## 5. Google Maps URL Configuration

Never hardcode Google Maps API keys into frontend code. Use Google Maps universal search URLs:
- Format: `https://www.google.com/maps/search/?api=1&query=` + encoded business name and locality.
- Example: `https://www.google.com/maps/search/?api=1&query=CHC+Khairabad+Sitapur`
This opens directly in the user's Google Maps app on Android / iPhone and in the browser on desktop without any billing required.

---

## 6. How to Connect Google Forms for "Add Your Business"

Because Blogger does not provide a backend database for form submissions:
1. Go to [Google Forms](https://forms.google.com) and create a form named **"Khairabad City Directory – Listing Request"**.
2. Add fields:
   - Business Name (Short answer)
   - Category (Dropdown or Multiple choice)
   - Area / Locality (Dropdown)
   - Full Address (Paragraph)
   - Calling Phone (Short answer)
   - WhatsApp Number (Short answer)
   - Timings / Opening Hours (Short answer)
   - Business Description (Paragraph)
3. Click **Send** -> copy the form link or embed iframe link.
4. In `blogger-theme.xml`, replace the form submission action or button to open this Google Form link in a modal or new tab. Submissions will automatically populate a free Google Sheet for your review!

---

## 7. Connecting Google Apps Script (Automated Submissions)

If you want the in-theme form to submit straight to Google Sheets via AJAX without leaving the page:
1. Open your Google Sheet linked to the Google Form.
2. Click **Extensions** -> **Apps Script**.
3. Paste the following script:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.name,
    data.category,
    data.locality,
    data.address,
    data.phone,
    data.whatsapp,
    data.hours,
    data.desc
  ]);
  return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```
4. Click **Deploy** -> **New Deployment** -> Select **Web App**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL and point your form's `fetch()` call to this URL.

---

## 8. How to Add Google AdSense

The theme includes clean structural positions for advertising that comply with Google AdSense policies:
1. **Top Banner (Below Header):** Between the emergency ticker and the hero section.
2. **In-Directory Native Ad:** Insert an ad card after every 6th business card in `renderListings()`.
3. **Sidebar Ad:** In the desktop filter sidebar.
4. **Footer Ad:** Right above the copyright bar.

When approved for AdSense:
- Go to Blogger -> **Theme** -> **Edit HTML**.
- Paste your AdSense verification script inside the `<head>` tag.
- Paste your display ad units into the designated placeholder `<div>` containers.

---

## 9. SEO & Custom Domain Configuration

1. **Custom Domain:** Go to Blogger -> **Settings** -> **Custom domain** -> enter your domain (e.g. `khairabadcity.in`). Follow the DNS instructions to add the CNAME and 4 Google A-records.
2. **HTTPS:** Enable **HTTPS availability** and **HTTPS redirect** in Blogger settings.
3. **Robots.txt & Sitemap:**
   - Blogger automatically produces `https://yourblog.blogspot.com/sitemap.xml`.
   - Submit this sitemap to Google Search Console to rank for keywords like *"Khairabad marriage lawn"*, *"Khairabad hospital"*, *"Khairabad doctors"*, and *"Khairabad restaurants"*.

---

## 10. Future Upgrade Path

If the directory grows to thousands of records:
1. **Google Sheets as Live Database:** Use the Google Sheets v4 Public API or Apps Script JSON endpoint to fetch listings dynamically without modifying the template.
2. **Firebase Firestore:** Migrate `KHAIRABAD_DATA.listings` to Cloud Firestore. The existing UI code can simply subscribe to Firestore collections.
3. **Progressive Web App (PWA):** Add a `manifest.json` and a service worker script to allow Android and iPhone users to install "Khairabad City" onto their home screens.
