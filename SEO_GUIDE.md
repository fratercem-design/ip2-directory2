# SEO Optimization Guide

This guide covers the SEO optimizations implemented for the Cult of Psyche website.

## Overview

The site has been optimized for search engines with:
- Comprehensive metadata (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD) for rich snippets
- XML sitemap
- Robots.txt
- Canonical URLs
- Semantic HTML

## Files Created

### Core SEO Files

1. **`src/app/robots.ts`** - Robots.txt configuration
   - Allows all search engines to crawl the site
   - Disallows admin, API, and private routes
   - Points to sitemap

2. **`src/app/sitemap.ts`** - XML sitemap generation
   - Lists all public pages
   - Includes priority and change frequency
   - Updates automatically

3. **`src/lib/seo.ts`** - SEO utility functions
   - `generateMetadata()` - Creates page metadata
   - `generateStructuredData()` - Creates JSON-LD structured data

4. **`src/components/structured-data.tsx`** - React component for structured data
   - Renders JSON-LD script tags

## Metadata Structure

### Root Layout (`src/app/layout.tsx`)

The root layout includes comprehensive default metadata:
- Site title with template
- Description
- Keywords
- Open Graph tags
- Twitter Card tags
- Robots directives
- Verification codes (placeholders)

### Page-Level Metadata

Each page can export its own `metadata` object:

```typescript
export const metadata: Metadata = {
    title: "Page Title",
    description: "Page description",
    keywords: ["keyword1", "keyword2"],
    openGraph: {
        title: "Open Graph Title",
        description: "Open Graph description",
        images: ["/og-image.jpg"]
    }
};
```

## Structured Data

Structured data (JSON-LD) is added to pages for rich snippets:

### Organization Schema
- Added to homepage and about page
- Includes social media links
- Defines the organization

### WebSite Schema
- Added to homepage
- Includes search action
- Defines the website

### Article Schema
- For blog posts (to be implemented)
- Includes author, publish date, etc.

## Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://cultofpsyche.com
```

This is used for:
- Canonical URLs
- Open Graph URLs
- Sitemap URLs
- Structured data URLs

## Implementation Checklist

### ✅ Completed

- [x] Root layout metadata
- [x] Robots.txt
- [x] Sitemap.xml
- [x] SEO utility functions
- [x] Structured data component
- [x] Homepage metadata and structured data
- [x] About page metadata and structured data

### 🔄 To Do

- [ ] Add metadata to all pages:
  - [ ] Blog listing page
  - [ ] Blog post pages (with Article schema)
  - [ ] Services page
  - [ ] Glossary pages
  - [ ] Testimonials pages
  - [ ] Member directory pages
  - [ ] Divination page
  - [ ] Message board pages

- [ ] Create Open Graph image (`/public/og-image.jpg`)
  - Recommended size: 1200x630px
  - Should include site branding

- [ ] Add verification codes:
  - Google Search Console
  - Bing Webmaster Tools
  - Yandex (if needed)

- [ ] Enhance sitemap with dynamic content:
  - Blog posts
  - Testimonials
  - Glossary entries
  - Member profiles (if public)

- [ ] Add alt text to all images
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Add breadcrumbs structured data
- [ ] Implement FAQ schema (if applicable)

## Best Practices

### Title Tags
- Keep under 60 characters
- Include brand name
- Be descriptive and keyword-rich
- Use template: `%s | Cult of Psyche`

### Meta Descriptions
- Keep under 160 characters
- Include primary keywords
- Write compelling copy
- Include a call to action

### Keywords
- Focus on 5-10 relevant keywords
- Include long-tail keywords
- Avoid keyword stuffing
- Update based on search trends

### Open Graph Images
- Use 1200x630px images
- Include text/logo
- Make them visually appealing
- Test on social platforms

### Structured Data
- Validate with Google's Rich Results Test
- Keep data accurate and up-to-date
- Use appropriate schema types
- Don't duplicate information

## Testing

### Tools to Use

1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing
   - Check for errors

2. **Google Rich Results Test**
   - Test structured data
   - Validate JSON-LD
   - Preview rich snippets

3. **PageSpeed Insights**
   - Check performance
   - Optimize Core Web Vitals
   - Improve loading speed

4. **Lighthouse (Chrome DevTools)**
   - SEO score
   - Best practices
   - Accessibility

5. **Social Media Debuggers**
   - Facebook Sharing Debugger
   - Twitter Card Validator
   - LinkedIn Post Inspector

## Monitoring

### Key Metrics

- Organic search traffic
- Keyword rankings
- Click-through rate (CTR)
- Bounce rate
- Pages per session
- Average session duration

### Regular Tasks

- Update sitemap when adding new pages
- Review and update metadata quarterly
- Monitor search console for errors
- Track keyword performance
- Update structured data as needed

## Next Steps

1. **Add metadata to remaining pages** - Use the `generateMetadata()` function from `src/lib/seo.ts`

2. **Create Open Graph image** - Design and add `/public/og-image.jpg`

3. **Set up Google Search Console** - Add verification code and submit sitemap

4. **Enhance dynamic sitemap** - Fetch blog posts, testimonials, etc. from database

5. **Add breadcrumbs** - Implement breadcrumb navigation with structured data

6. **Optimize images** - Convert to WebP, add lazy loading, optimize sizes

7. **Add FAQ schema** - If applicable, add FAQ structured data

8. **Monitor and iterate** - Track performance and make improvements

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
