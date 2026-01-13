# 📢 Banner Advertising System Guide

## Overview
A comprehensive banner advertising system for managing and displaying ads across the Cult of Psyche site, with tracking, targeting, and campaign management.

## Features

### Ad Management
- **Campaigns**: Organize ads into campaigns
- **Multiple Ad Sizes**: Banner, sidebar, square, skyscraper, leaderboard
- **Positioning**: Top, bottom, sidebar, inline, floating
- **Scheduling**: Start and end dates
- **Priority System**: Control which ads show first
- **Impression/Click Limits**: Set maximum impressions or clicks

### Targeting
- **Page Targeting**: Show ads on specific pages or paths
- **Page Exclusion**: Exclude specific pages
- **Wildcard Support**: Use `*` for pattern matching
- **Date Range**: Schedule ads for specific periods

### Tracking & Analytics
- **Impression Tracking**: Track every ad view
- **Click Tracking**: Track every ad click
- **CTR Calculation**: Click-through rate metrics
- **User Tracking**: Track by user (if authenticated)
- **IP Tracking**: Track by IP address
- **Page Path Tracking**: Track which pages show ads

### Display Features
- **Automatic Selection**: Random ad from available pool
- **Smart Filtering**: Filters by position, date, limits, targeting
- **Dismissible**: Floating ads can be dismissed
- **Responsive**: Adapts to different screen sizes
- **Non-Intrusive**: "Ad" label for transparency

## Database Schema

### Tables

#### `ad_campaigns`
Campaign management:
- `name`: Campaign name
- `description`: Campaign description
- `advertiser_name`: Advertiser contact
- `advertiser_email`: Advertiser email
- `is_active`: Campaign status
- `start_date`: Campaign start date
- `end_date`: Campaign end date
- `budget`: Optional budget tracking

#### `banner_ads`
Individual ads:
- `campaign_id`: Parent campaign
- `title`: Ad title
- `image_url`: Ad image URL
- `link_url`: Destination URL
- `alt_text`: Image alt text
- `ad_size`: banner, sidebar, square, skyscraper, leaderboard
- `position`: top, bottom, sidebar, inline, floating
- `target_pages`: Array of page paths to show on
- `exclude_pages`: Array of page paths to exclude
- `is_active`: Ad status
- `priority`: Display priority (higher = first)
- `start_date`: Ad start date
- `end_date`: Ad end date
- `max_impressions`: Optional impression limit
- `max_clicks`: Optional click limit
- `current_impressions`: Current impression count
- `current_clicks`: Current click count

#### `ad_impressions`
Impression tracking:
- `ad_id`: Ad viewed
- `user_id`: User who viewed (if authenticated)
- `page_path`: Page where ad was shown
- `ip_address`: Viewer IP
- `user_agent`: Browser info
- `viewed_at`: Timestamp

#### `ad_clicks`
Click tracking:
- `ad_id`: Ad clicked
- `impression_id`: Related impression
- `user_id`: User who clicked
- `page_path`: Page where clicked
- `ip_address`: Clicker IP
- `user_agent`: Browser info
- `clicked_at`: Timestamp

### Run Schema
Execute `src/lib/db/banner_ads_schema.sql` in Supabase SQL editor.

## API Endpoints

### Get Ad
```
GET /api/ads?position=top&page_path=/blog
```
Returns a random ad for the specified position and page.

**Query Parameters:**
- `position`: top, bottom, sidebar, inline, floating
- `page_path`: Current page path (default: "/")

### Record Impression
```
POST /api/ads/impression
Body: {
  ad_id: string (uuid),
  page_path?: string
}
```

### Record Click
```
POST /api/ads/click
Body: {
  ad_id: string (uuid),
  impression_id?: string (uuid),
  page_path?: string
}
```

## Component Usage

### Basic Usage
```tsx
import { BannerAd } from "@/components/banner-ad";

// Top banner
<BannerAd position="top" />

// Sidebar ad
<BannerAd position="sidebar" />

// Bottom banner
<BannerAd position="bottom" />

// Floating ad
<BannerAd position="floating" />

// Inline ad (in content)
<BannerAd position="inline" />
```

### With Custom Page Path
```tsx
<BannerAd position="sidebar" pagePath="/blog" />
```

## Ad Sizes

- **banner**: Full width, 24px height (728x90 equivalent)
- **sidebar**: 4:5 aspect ratio (300x250 equivalent)
- **square**: 1:1 aspect ratio (250x250)
- **skyscraper**: 1:3 aspect ratio (160x600)
- **leaderboard**: Full width, 20px height (728x90)

## Positions

- **top**: Sticky at top of page
- **bottom**: Sticky at bottom of page
- **sidebar**: In sidebar area
- **inline**: Within content flow
- **floating**: Fixed position, dismissible

## Page Targeting

### Target Specific Pages
```sql
UPDATE banner_ads
SET target_pages = ARRAY['/blog', '/about']
WHERE id = 'ad-id';
```

### Wildcard Patterns
```sql
-- Show on all blog pages
UPDATE banner_ads
SET target_pages = ARRAY['/blog/*']
WHERE id = 'ad-id';

-- Show on all pages
UPDATE banner_ads
SET target_pages = ARRAY['*']
WHERE id = 'ad-id';
```

### Exclude Pages
```sql
UPDATE banner_ads
SET exclude_pages = ARRAY['/admin/*', '/login']
WHERE id = 'ad-id';
```

## Admin Interface

Access at `/admin/ads`:
- View all campaigns and ads
- See impression/click statistics
- View CTR (click-through rate)
- Monitor ad performance
- Check ad status and limits

## Best Practices

### Ad Creation
1. **High Quality Images**: Use clear, optimized images
2. **Appropriate Sizing**: Match ad size to position
3. **Clear CTAs**: Make call-to-action obvious
4. **Fast Loading**: Optimize image file sizes
5. **Mobile Friendly**: Ensure ads work on mobile

### Campaign Management
1. **Set Clear Dates**: Use start/end dates for campaigns
2. **Monitor Performance**: Track CTR and adjust
3. **Set Limits**: Use impression/click limits to control spend
4. **Test Targeting**: Verify page targeting works
5. **Review Regularly**: Check ad performance weekly

### Targeting
1. **Be Specific**: Target relevant pages
2. **Use Wildcards**: For page sections
3. **Exclude Admin**: Always exclude admin pages
4. **Test Different Positions**: Find what works
5. **Monitor Placement**: Ensure ads don't interfere with content

## Privacy & Compliance

### Data Collection
- IP addresses (for analytics)
- User agents (for analytics)
- Page paths (for targeting)
- User IDs (if authenticated)

### Best Practices
- **Transparency**: "Ad" label on all ads
- **User Control**: Dismissible floating ads
- **Privacy**: Consider GDPR/CCPA compliance
- **Disclosure**: Clear advertising disclosure
- **Opt-out**: Consider user opt-out options

## Performance

### Optimization
- **Lazy Loading**: Ads load on demand
- **Caching**: Ad selection cached briefly
- **Efficient Queries**: Optimized database queries
- **Image Optimization**: Compress ad images
- **CDN**: Use CDN for ad images

### Monitoring
- Track impression/click rates
- Monitor ad performance
- Check for broken links
- Verify image loading
- Review user feedback

## Future Enhancements

### Advanced Features
- **A/B Testing**: Test different ad variations
- **Geographic Targeting**: Target by location
- **Device Targeting**: Mobile vs desktop
- **Time-based**: Show ads at specific times
- **Frequency Capping**: Limit per user

### Analytics
- **Detailed Reports**: Export analytics
- **Conversion Tracking**: Track conversions
- **Revenue Tracking**: Track ad revenue
- **Performance Dashboards**: Visual analytics
- **Email Reports**: Automated reports

### Ad Formats
- **Video Ads**: Support video banners
- **Rich Media**: Interactive ads
- **Native Ads**: Content-style ads
- **Sponsored Content**: Sponsored posts

---

*"Advertising is the art of connection. When done right, it serves both advertiser and audience."*
