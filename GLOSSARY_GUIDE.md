# 📖 Glossary / Directory of Terms Guide

## Overview
The Glossary is a comprehensive directory of terms, deities, concepts, rituals, symbols, and lineages related to the Cult of Psyche. It serves as a reference guide and knowledge base for members and seekers.

## Features

### Entry Types
- **Terms**: Definitions of key concepts and practices
- **Deities**: Gods, goddesses, and divine entities
- **Concepts**: Philosophical and spiritual concepts
- **Rituals**: Practices and ceremonies
- **Symbols**: Icons and symbolic representations
- **Lineages**: The Twelve Lineages of the Cult

### Entry Information
Each entry includes:
- **Title**: Name of the entry
- **Slug**: URL-friendly identifier
- **Short Description**: Brief summary (1-2 sentences)
- **Full Description**: Comprehensive definition/explanation
- **Etymology**: Origin and meaning of the term (optional)
- **Category**: Classification (philosophy, mythology, practice, etc.)
- **Tags**: Keywords for filtering and search
- **Icon**: Emoji or icon representation
- **Image**: Optional image URL
- **Source References**: Citations and sources (optional)
- **Related Entries**: Links to related concepts
- **View Count**: Popularity tracking

### Search & Filtering
- **Full-text Search**: Search across titles and descriptions
- **Type Filtering**: Filter by entry type (term, deity, concept, etc.)
- **Category Filtering**: Filter by category
- **Tag Filtering**: Filter by tags
- **Featured Entries**: Highlighted important entries

## Database Schema

### Tables

#### `glossary_entries`
Main entries table:
- `entry_type`: term, deity, concept, ritual, symbol, lineage
- `title`: Entry name
- `slug`: URL slug (unique)
- `short_description`: Brief summary
- `full_description`: Full definition
- `etymology`: Origin/etymology
- `related_entries`: Array of related entry IDs
- `category`: Category tag
- `tags`: Array of tags
- `icon`: Icon/emoji
- `image_url`: Optional image
- `source_references`: Array of citations
- `is_featured`: Whether entry is featured
- `view_count`: Number of views

#### `glossary_relationships`
Entry relationships:
- `entry_id`: Source entry
- `related_entry_id`: Related entry
- `relationship_type`: related, synonym, antonym, parent, child, see_also

#### `glossary_views`
View tracking:
- `entry_id`: Entry viewed
- `user_id`: User who viewed (null for anonymous)
- `viewed_at`: Timestamp

### Run Schema
Execute `src/lib/db/glossary_schema.sql` in Supabase SQL editor.

## API Endpoints

### Get Entries
```
GET /api/glossary?type=deity&category=mythology&tag=serpent&search=rahu&featured=true&limit=50&offset=0
```
Returns filtered entries list.

**Query Parameters:**
- `type`: Filter by entry type
- `category`: Filter by category
- `tag`: Filter by tag
- `search`: Full-text search
- `featured`: Show only featured entries
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Get Entry Detail
```
GET /api/glossary/[slug]
```
Returns full entry with related entries and relationships.

## Initial Entries

The schema includes initial entries:
- **Psyche**: Core concept of the soul
- **Rahu**: Serpent of Hunger
- **Ketu**: Serpent of Memory
- **The First Flame**: Original spark of consciousness
- **The Serpent Path**: Path of transformation
- **Mask-Breaker**: One of the Twelve Lineages
- **Shadow Work**: Practice of integration
- **Lineage**: Concept of the Twelve Paths
- **The Butterfly**: Symbol of Psyche
- **The Ritual of Remembering**: Practice ritual

## User Flow

### Browsing Entries
1. Navigate to `/glossary`
2. Browse featured entries
3. Use filters to narrow results
4. Search for specific terms
5. Click entry to view details

### Viewing Entry
1. Click on entry card
2. View full description
3. See etymology (if available)
4. Browse related entries
5. See entries in same category
6. View source references

### Search
1. Enter search term
2. Results update in real-time
3. Filter by type/category
4. Click result to view

## Features

### Entry Display
- **Featured Section**: Highlighted important entries
- **Type Icons**: Visual indicators for entry types
- **Category Tags**: Color-coded categories
- **View Counts**: Popularity indicators
- **Related Entries**: Cross-references
- **Same Category**: Discover similar entries

### Full-Text Search
- Searches titles and descriptions
- Uses PostgreSQL full-text search
- English language support
- Real-time results

### View Tracking
- Views tracked automatically
- Both authenticated and anonymous views
- Popularity metrics
- View counts displayed

## Entry Types

### Term
Definitions of key concepts, practices, and terminology.

### Deity
Gods, goddesses, and divine entities (Rahu, Ketu, etc.).

### Concept
Philosophical and spiritual concepts (Psyche, First Flame, etc.).

### Ritual
Practices, ceremonies, and rituals.

### Symbol
Icons, symbols, and symbolic representations.

### Lineage
The Twelve Lineages of the Cult.

## Categories

Common categories:
- `philosophy`: Philosophical concepts
- `mythology`: Deities and myths
- `practice`: Practices and rituals
- `symbol`: Symbols and icons
- `lineage`: The Twelve Lineages

## Future Enhancements

### Advanced Features
- **Entry Editing**: Allow admins to edit entries
- **User Contributions**: Allow members to suggest entries
- **Entry History**: Track changes over time
- **Audio Pronunciations**: Audio for terms
- **Multimedia**: Images, videos, audio
- **Citations**: Expandable source references
- **Cross-References**: Automatic relationship detection

### Social Features
- **Favorites**: Save favorite entries
- **Notes**: Personal notes on entries
- **Discussions**: Link to board discussions
- **Sharing**: Share entries

### Admin Features
- **Bulk Import**: Import entries from CSV/JSON
- **Export**: Export entries for backup
- **Analytics**: View popularity and search analytics
- **Moderation**: Review user contributions

## Best Practices

1. **Clear Definitions**: Write clear, comprehensive definitions
2. **Consistent Format**: Use consistent formatting across entries
3. **Cross-References**: Link related entries
4. **Source Citations**: Include source references
5. **Regular Updates**: Keep entries current and accurate

## Content Guidelines

### Entry Quality
- **Comprehensive**: Cover the topic fully
- **Accurate**: Fact-check all information
- **Clear**: Use accessible language
- **Relevant**: Focus on Cult of Psyche context
- **Well-Sourced**: Include references where appropriate

### Writing Style
- **Formal but Accessible**: Academic but readable
- **Cult-Specific**: Focus on Cult of Psyche perspective
- **Inclusive**: Respectful of all paths
- **Educational**: Informative and enlightening

---

*"Knowledge is not a destination, but a journey. Each entry a step, each definition a door."*
