# 📝 Blog & AI Generation Guide

## Overview
The blog system features AI-generated daily articles and horoscopes, automatically created each day using OpenAI and Anthropic APIs.

## Features

### Daily Content Generation
- **Automatic Articles**: Daily articles generated at 6 AM
- **Daily Horoscopes**: All 12 zodiac signs generated daily
- **AI-Powered**: Uses GPT-4 for articles, Claude for horoscopes
- **Cult-Specific**: Content aligned with Cult of Psyche themes

### Blog Features
- **Article Types**: Articles, horoscopes, updates, essays
- **Categories**: Philosophy, practice, community, astrology
- **Tags**: Flexible tagging system
- **Featured Posts**: Highlight important content
- **View Tracking**: Track post popularity
- **Search**: Full-text search capability

## Database Schema

### Tables

#### `blog_posts`
Main blog posts table:
- `title`: Post title
- `slug`: URL-friendly identifier
- `excerpt`: Short summary
- `content`: Full post content
- `post_type`: article, horoscope, update, essay
- `category`: Post category
- `tags`: Array of tags
- `is_published`: Publication status
- `is_featured`: Featured post flag
- `is_ai_generated`: AI generation flag
- `ai_model`: Model used (gpt-4, claude, etc.)
- `view_count`: Popularity tracking

#### `horoscopes`
Daily horoscopes:
- `date`: Date of horoscope
- `sign`: Zodiac sign
- `title`: Horoscope title
- `content`: Horoscope content
- `is_ai_generated`: Always true
- `ai_model`: Model used

### Run Schema
Execute `src/lib/db/blog_schema.sql` in Supabase SQL editor.

## API Endpoints

### Generate Content
```
POST /api/blog/generate
Authorization: Bearer {ADMIN_SECRET}
Body: {
  type: "article" | "horoscope",
  topic?: string,
  sign?: string,
  date?: string
}
```

### Get Posts
```
GET /api/blog/posts?type=article&category=philosophy&featured=true&limit=20&offset=0
```

### Get Horoscopes
```
GET /api/blog/horoscopes?date=2024-01-01&sign=aries
```

## AI Configuration

### Required Environment Variables
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
ADMIN_SECRET=your_admin_secret
NEXT_PUBLIC_VERCEL_URL=https://your-domain.com
```

### AI Models Used
- **Articles**: GPT-4 (OpenAI)
- **Horoscopes**: Claude 3.5 Sonnet (Anthropic)

### Prompt Engineering
Both models use system prompts that:
- Establish Cult of Psyche context
- Request mystical, thoughtful writing
- Encourage poetic language
- Focus on shadow work and transformation

## Daily Generation

### Inngest Function
The `generate-daily-content` function runs daily at 6 AM:
1. Generates one article
2. Generates 12 horoscopes (one per sign)
3. Saves all content to database

### Manual Generation
You can manually trigger generation:
```bash
curl -X POST https://your-domain.com/api/blog/generate \
  -H "Authorization: Bearer {ADMIN_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{"type": "article"}'
```

## Content Themes

### Article Topics
Default topics include:
- The nature of shadow work
- Understanding Rahu and Ketu
- The Serpent Path of transformation
- Psyche and the journey inward
- The First Flame of consciousness
- Integrating light and dark
- The Twelve Lineages
- Memory and forgetting
- Desire as direction
- The mask and the truth

### Horoscope Style
Horoscopes:
- Connect astrological themes to shadow work
- Reference Rahu (desire) and Ketu (release)
- Mention the Serpent Path
- Offer practical daily guidance
- Be mystical but accessible

## Pages

### Blog Listing (`/blog`)
- Featured posts section
- Filter by type (article, horoscope)
- Post cards with metadata
- Pagination support

### Horoscopes Page (`/blog/horoscopes`)
- All 12 signs displayed
- Date selector
- Daily horoscope grid
- Sign-specific views

### Post Detail (`/blog/[slug]`)
- Full post content
- View tracking
- Tags and categories
- Related posts (future)

## Customization

### Article Topics
Edit the topics array in `generate/route.ts`:
```tsx
const topics = [
    "Your custom topic",
    "Another topic"
];
```

### Horoscope Prompts
Modify the horoscope prompt in `generate/route.ts` to change style or focus.

### Generation Schedule
Change the cron schedule in `generate-daily-content.ts`:
```tsx
{ cron: "0 6 * * *" } // 6 AM daily
```

## Best Practices

1. **Review Content**: Review AI-generated content before publishing
2. **Edit as Needed**: AI content may need editing for accuracy
3. **Monitor Costs**: Track API usage and costs
4. **Quality Control**: Set up review process
5. **Backup**: Regular backups of generated content

## Cost Considerations

### API Costs (Approximate)
- **GPT-4**: ~$0.03 per article (800-1200 words)
- **Claude 3.5**: ~$0.015 per horoscope (150-250 words)
- **Daily Cost**: ~$0.25/day (1 article + 12 horoscopes)
- **Monthly Cost**: ~$7.50/month

### Optimization
- Use cheaper models for drafts
- Cache generated content
- Batch API calls
- Monitor usage

## Future Enhancements

### Content Features
- **Editorial Review**: Admin review workflow
- **User Comments**: Comments on posts
- **Related Posts**: Automatic related post suggestions
- **Newsletter**: Email digest of daily content
- **RSS Feed**: RSS feed for blog

### AI Features
- **Image Generation**: AI-generated featured images
- **SEO Optimization**: AI-optimized titles and descriptions
- **Content Variations**: Multiple versions per topic
- **Translation**: Multi-language support

---

*"Words flow from the void, shaped by intention, guided by truth. Each article a reflection, each horoscope a mirror."*
