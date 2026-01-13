# Recommendations Page Guide

## Overview
The Recommendations page allows you to showcase products, services, books, tools, and resources that align with the Cult of Psyche philosophy.

## How to Add Recommendations

### Step 1: Edit the Recommendations Array
Open `src/app/recommendations/page.tsx` and find the `recommendations` array (around line 20).

### Step 2: Add Your Recommendation
Add a new object to the array with this structure:

```typescript
{
    title: "Product/Service Name",
    description: "A detailed description of why you recommend this and how it aligns with the path.",
    url: "https://link-to-product-or-service.com",
    category: "book" | "service" | "tool" | "resource" | "other",
    icon: <Book className="h-5 w-5" /> // Optional, uses default if not provided
}
```

### Example Recommendations

#### Book:
```typescript
{
    title: "The Shadow Work Guide",
    description: "An essential book for understanding shadow work and integration. This has been foundational for many on the Serpent Path.",
    url: "https://example.com/book",
    category: "book"
}
```

#### Service:
```typescript
{
    title: "Tarot Reading Service",
    description: "A trusted tarot reader who understands the deeper aspects of the path. Recommended for those seeking clarity.",
    url: "https://example.com/service",
    category: "service"
}
```

#### Tool:
```typescript
{
    title: "Meditation App",
    description: "A powerful tool for daily practice. Supports the Lunar Mirror Invocation work.",
    url: "https://example.com/tool",
    category: "tool"
}
```

#### Resource:
```typescript
{
    title: "Astrology Resource",
    description: "Deep dive into Rahu and Ketu. Essential for understanding the Serpent Oath.",
    url: "https://example.com/resource",
    category: "resource"
}
```

## Categories

- **book**: Books, ebooks, publications
- **service**: Services, consultations, readings
- **tool**: Apps, software, practical tools
- **resource**: Websites, courses, educational content
- **other**: Anything else that doesn't fit the above

## Custom Icons

You can use any Lucide icon. Import it at the top:
```typescript
import { Book, Sparkles, Moon, Flame, Heart, Star, Wand2 } from "lucide-react";
```

Then use it:
```typescript
icon: <Star className="h-5 w-5" />
```

## Styling

Each category has its own color scheme:
- **book**: Purple gradient
- **service**: Blue gradient
- **tool**: Indigo gradient
- **resource**: Emerald gradient
- **other**: Zinc/gray gradient

## Best Practices

1. **Be Authentic**: Only recommend things you genuinely use and believe in
2. **Clear Descriptions**: Explain why it's relevant to the path
3. **Direct Links**: Use affiliate links if you have them (disclose in disclaimer)
4. **Regular Updates**: Keep the list current and relevant
5. **Quality Over Quantity**: Better to have fewer, high-quality recommendations

## Affiliate Links

If you use affiliate links:
1. Update the disclaimer section to mention affiliate relationships
2. Ensure compliance with FTC guidelines
3. Be transparent with your community

## Current Disclaimer

The page includes a disclaimer about potential compensation. You can modify it in the "Disclaimer" section of the page component.

---

*The recommendations page automatically groups items by category and displays them in an organized, visually appealing grid.*
