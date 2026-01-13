# 👥 Member Directory Guide

## Overview
The member directory allows users to discover and connect with other members of the Cult of Psyche community. Members can create public profiles, view stats, and explore the community.

## Features

### Public Directory
- **Browse Members**: View all public member profiles
- **Search**: Search by name or bio
- **Sorting**: Sort by newest, tokens, follows, or name
- **Pagination**: Navigate through members
- **Member Cards**: Quick view of member stats (tokens, follows, clips, readings)

### Member Profiles
- **Public Profile Pages**: Individual member profile pages
- **Stats Display**: Token balance, follows, clips, readings
- **Activity Summary**: Comprehensive activity overview
- **Privacy Controls**: Members can control what's visible

### Profile Management
- **Edit Profile**: Update display name, bio, avatar
- **Privacy Settings**: Control public visibility
- **Token Visibility**: Option to show/hide token balance
- **Activity Visibility**: Option to show/hide activity stats

## Database Schema

### Tables

#### `user_profiles`
Stores public-facing member information:
- `user_id`: Reference to auth.users
- `display_name`: Public display name
- `bio`: Member biography
- `avatar_url`: Profile picture URL
- `is_public`: Whether profile appears in directory
- `show_tokens`: Privacy setting for token balance
- `show_activity`: Privacy setting for activity stats

### Run Schema
Execute `src/lib/db/member_directory_schema.sql` in Supabase SQL editor.

## API Endpoints

### Get Members List
```
GET /api/members?search=query&sort=member_since&order=desc&limit=50&offset=0
```
Returns paginated list of public members with stats.

**Query Parameters:**
- `search`: Search term (name or bio)
- `sort`: Sort field (`member_since`, `tokens`, `follows`, `name`)
- `order`: Sort order (`asc`, `desc`)
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Get Member Profile
```
GET /api/members/[id]
```
Returns detailed member profile with stats.

### Get Own Profile
```
GET /api/members/profile
```
Returns current user's profile settings.

### Update Profile
```
PUT /api/members/profile
Body: {
  display_name?: string,
  bio?: string,
  avatar_url?: string,
  is_public?: boolean,
  show_tokens?: boolean,
  show_activity?: boolean
}
```

## User Flow

### Viewing Directory
1. Navigate to `/members`
2. Browse member cards
3. Use search to find specific members
4. Sort by different criteria
5. Click member card to view profile

### Viewing Profile
1. Click on member card
2. View profile header with avatar and bio
3. See stats grid (tokens, follows, clips, readings)
4. Review activity summary
5. If own profile, see "Edit Profile" button

### Editing Profile
1. Go to `/me` page
2. Click "Edit Profile" (future: add this button)
3. Update display name, bio, avatar
4. Adjust privacy settings
5. Save changes

## Privacy Settings

### `is_public`
- `true`: Profile appears in directory and is searchable
- `false`: Profile is hidden from directory (only visible to owner)

### `show_tokens`
- `true`: Token balance visible on profile
- `false`: Token balance hidden (privacy)

### `show_activity`
- `true`: Activity stats visible (follows, clips, readings)
- `false`: Activity stats hidden (privacy)

## Member Stats

### Displayed Stats
- **Token Balance**: Current token balance
- **Total Earned**: Lifetime tokens earned
- **Follows Count**: Number of streamers followed
- **Clips Count**: Number of clips created
- **Readings Count**: Number of divination readings

### Stats Aggregation
Stats are computed in real-time from:
- `user_tokens` table
- `follows` table
- `clips` table
- `divination_readings` table

## Search & Filtering

### Search Functionality
- Searches `display_name` and `bio` fields
- Case-insensitive
- Partial matching
- Resets pagination on search

### Sorting Options
1. **Newest**: Sort by `member_since` (default)
2. **Tokens**: Sort by token balance
3. **Follows**: Sort by follows count
4. **Name**: Sort alphabetically by display name

### Pagination
- Default: 24 members per page
- Configurable via API
- Previous/Next navigation
- Page indicator

## Design Features

### Member Cards
- Avatar or initials
- Display name
- Member since date
- Bio preview (2 lines)
- Stats grid (tokens, follows, clips, readings)
- Hover effects

### Profile Page
- Large avatar
- Full bio
- Stats grid
- Activity summary
- Edit button (own profile)

## Future Enhancements

### Social Features
- Follow other members
- Member-to-member messaging
- Activity feed
- Member badges/roles

### Advanced Search
- Filter by activity level
- Filter by token range
- Filter by join date
- Advanced filters panel

### Member Badges
- Achievement badges
- Role badges (Admin, Moderator, etc.)
- Special recognition badges

### Member Activity
- Recent activity timeline
- Shared clips
- Public readings (optional)
- Community contributions

## Best Practices

1. **Privacy First**: Respect user privacy settings
2. **Clear Communication**: Explain what's public vs private
3. **Profile Completion**: Encourage profile creation
4. **Community Building**: Use directory to connect members
5. **Moderation**: Monitor for inappropriate content

## Security Considerations

### RLS Policies
- Public profiles visible to all
- Private profiles only visible to owner
- Users can only edit their own profile
- Stats respect privacy settings

### Data Protection
- Email addresses not exposed publicly
- User IDs used for routing (not emails)
- Privacy settings enforced at API level
- No sensitive data in profiles

---

*"We are many, yet we are one. Each member a flame, together a beacon."*
