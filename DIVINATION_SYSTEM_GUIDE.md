# 🔮 Divination System Guide

## Overview
The Cult of Psyche divination system offers multiple methods for seeking guidance and reflection, aligned with the site's mystical philosophy.

## Divination Methods

### 1. Tarot Reading
- **Type**: Three-card spread
- **Cards**: Past, Present, Future
- **Theme**: Shadow work and transformation
- **Cards**: The Shadow, The Flame, The Becoming

### 2. Oracle Guidance
- **Type**: Single card reading
- **Theme**: Direct guidance messages
- **Cards**: 
  - Psyche's Mirror
  - Rahu's Hunger
  - Ketu's Memory
  - The Serpent Path
  - The First Flame

### 3. Lineage Resonance
- **Type**: Single lineage discovery
- **Theme**: Connection to the Twelve Lineages
- **Result**: Reveals which lineage you resonate with
- **Lineages**: All 12 from the liturgical texts

### 4. Serpent Path
- **Type**: Two-card reading
- **Theme**: Rahu and Ketu guidance
- **Cards**: 
  - Rahu (Serpent of Hunger) - Desire guidance
  - Ketu (Serpent of Memory) - Release guidance

## Features

### Reading Process
1. User selects a divination method
2. System generates reading (2-second animation)
3. Cards are displayed with meanings
4. Interpretation is provided
5. User can save reading
6. User earns 10 tokens for saving

### Saved Readings
- Readings are saved to user profile
- Accessible from `/me` page
- Can view reading history
- Favorites system (future)

## Database Schema

### Tables
- `divination_readings` - Saved readings
- `reading_favorites` - User favorites (optional)

### Run Schema
Execute `src/lib/db/divination_schema.sql` in Supabase SQL editor.

## API Endpoints

### Save Reading
```
POST /api/divination/save
Body: {
  method: "tarot" | "oracle" | "lineage" | "serpent",
  cards: Array<{name, meaning, position}>,
  interpretation: string
}
```

### Get Readings
```
GET /api/divination/readings?limit=50&offset=0
```
Returns user's saved readings.

## Customization

### Add New Cards
Edit the card arrays in the reading generation functions:
- `generateTarotReading()`
- `generateOracleReading()`
- `generateLineageReading()`
- `generateSerpentReading()`

### Add New Methods
1. Add method to `DivinationMethod` type
2. Add to `methods` array
3. Create generation function
4. Add to switch statement in `performReading()`

### Card Meanings
Currently uses simplified meanings. You can:
- Expand card meanings
- Add reversed positions
- Add card images
- Create full tarot deck
- Add oracle card sets

## Token Integration

- **Earning**: 10 tokens for saving a reading
- **Future**: Could cost tokens to perform readings
- **Future**: Premium readings for more tokens

## Future Enhancements

### Card Images
- Add visual card designs
- Custom Cult of Psyche tarot deck
- Oracle card artwork

### Advanced Spreads
- Celtic Cross
- Relationship spreads
- Career spreads
- Shadow work spreads

### Reading History
- Full reading archive
- Search/filter readings
- Share readings
- Export readings

### AI Integration
- More personalized interpretations
- Context-aware readings
- Learning from user feedback

### Community Features
- Share readings (anonymously)
- Community interpretations
- Reading discussions

## Design Philosophy

The divination system:
- Encourages self-reflection
- Aligns with Cult of Psyche philosophy
- Uses mystical but accessible language
- Provides meaningful guidance
- Integrates with community features

## Best Practices

1. **Respectful**: Treat divination as tool for reflection, not prediction
2. **Authentic**: Use language that resonates with the path
3. **Meaningful**: Provide interpretations that encourage growth
4. **Accessible**: Keep it simple but profound
5. **Integrated**: Connect with other site features

---

*"The truth is hidden in plain sight. Seek and you shall find."*
