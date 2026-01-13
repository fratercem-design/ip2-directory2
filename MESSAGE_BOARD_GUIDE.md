# 💬 Message Board Guide

## Overview
The message board is a forum-style discussion system where members can create topics, post replies, and engage in community discussions organized by categories.

## Features

### For Members
- **Create Topics**: Start new discussion threads
- **Post Replies**: Reply to existing topics
- **Category Organization**: Topics organized by category
- **View Tracking**: View counts tracked automatically
- **Reply Counts**: Automatic reply counting
- **Pinned Topics**: Important topics pinned to top
- **Locked Topics**: Topics can be locked to prevent new replies

### Categories
Default categories included:
- **General Discussion**: General conversations and community chat
- **Divination & Readings**: Share divination experiences
- **Philosophy & Teachings**: Discuss teachings and philosophy
- **Streams & Content**: Talk about streams and content
- **Support & Guidance**: Seek and offer support
- **Announcements**: Official announcements (pinned by default)

### Admin Features
- **Pin Topics**: Pin important topics
- **Lock Topics**: Lock topics to prevent replies
- **Category Management**: Create/edit categories
- **Moderation**: Delete/edit any topic or post

## Database Schema

### Tables

#### `board_categories`
Forum categories:
- `name`: Category name
- `description`: Category description
- `slug`: URL-friendly slug
- `icon`: Icon (emoji or icon name)
- `color`: Hex color for category
- `sort_order`: Display order
- `is_active`: Whether category is active

#### `board_topics`
Discussion threads:
- `category_id`: Category this topic belongs to
- `user_id`: Author of the topic
- `title`: Topic title (3-200 characters)
- `content`: Topic content (minimum 10 characters)
- `is_pinned`: Whether topic is pinned
- `is_locked`: Whether topic is locked
- `view_count`: Number of views
- `reply_count`: Number of replies (auto-updated)
- `last_reply_at`: Timestamp of last reply
- `last_reply_by`: User who made last reply

#### `board_posts`
Replies to topics:
- `topic_id`: Topic this post replies to
- `user_id`: Author of the post
- `content`: Post content (minimum 10 characters)
- `is_edited`: Whether post was edited
- `edited_at`: Timestamp of edit

#### `topic_views`
View tracking:
- `topic_id`: Topic viewed
- `user_id`: User who viewed (null for anonymous)
- `viewed_at`: When viewed

#### `topic_reactions` & `post_reactions`
Reactions (likes, etc.):
- `topic_id` or `post_id`: What was reacted to
- `user_id`: User who reacted
- `reaction_type`: like, love, insightful, helpful

### Run Schema
Execute `src/lib/db/message_board_schema.sql` in Supabase SQL editor.

## API Endpoints

### Get Categories
```
GET /api/board/categories
```
Returns all active categories.

### Get Topics
```
GET /api/board/topics?category_id=uuid&limit=50&offset=0
```
Returns topics list with pagination.

**Query Parameters:**
- `category_id`: Filter by category (optional)
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Get Topic Detail
```
GET /api/board/topics/[id]
```
Returns topic with all replies and reactions.

### Create Topic
```
POST /api/board/topics
Body: {
  category_id: string (uuid),
  title: string (3-200 chars),
  content: string (min 10 chars)
}
```

### Create Reply
```
POST /api/board/posts
Body: {
  topic_id: string (uuid),
  content: string (min 10 chars)
}
```

## User Flow

### Creating a Topic
1. Navigate to `/board`
2. Click "New Topic"
3. Select category
4. Enter title (3-200 characters)
5. Write content (minimum 10 characters)
6. Submit topic
7. Redirected to topic page

### Viewing Topics
1. Navigate to `/board`
2. Browse all topics or filter by category
3. See pinned topics at top
4. View topic stats (replies, views, last reply)
5. Click topic to view details

### Replying to Topics
1. Open topic page
2. Scroll to reply form
3. Write reply (minimum 10 characters)
4. Submit reply
5. Reply appears in thread

## Features

### Topic Display
- **Pinned Topics**: Shown at top with pin icon
- **Locked Topics**: Shown with lock icon, no reply form
- **View Counts**: Tracked automatically
- **Reply Counts**: Updated via trigger
- **Last Reply**: Shows who replied last and when
- **Author Info**: Shows author avatar and name

### Category Filtering
- Click category card to filter
- "All Topics" shows everything
- Active category highlighted
- Categories show icon and color

### Topic Sorting
- Pinned topics first
- Then by last reply date
- Then by creation date
- Most recent activity at top

## Automatic Features

### View Tracking
- Views incremented on topic load
- Tracks both authenticated and anonymous views
- Prevents duplicate views from same user

### Reply Counting
- Automatic via database trigger
- Updates when posts are added
- Updates last reply info

### Last Reply Tracking
- Automatically updated on new reply
- Shows last reply author
- Shows last reply timestamp

## Security & Privacy

### RLS Policies
- Public can read topics and posts
- Authenticated users can create topics/posts
- Users can edit/delete their own content
- Locked topics prevent new replies

### Content Validation
- Title: 3-200 characters
- Content: Minimum 10 characters
- Category must exist
- Topic must exist for replies
- Locked topics reject replies

## Future Enhancements

### Advanced Features
- **Rich Text Editor**: Formatting, images, links
- **Post Editing**: Edit own posts with edit indicator
- **Post Deletion**: Delete own posts
- **Reactions**: Like, love, insightful, helpful
- **Mentions**: @mention users
- **Notifications**: Notify on replies
- **Search**: Search topics and posts
- **Bookmarks**: Save favorite topics

### Moderation
- **Report Posts**: Report inappropriate content
- **Admin Panel**: Manage topics and posts
- **User Bans**: Temporarily ban users
- **Content Filtering**: Auto-filter spam

### Social Features
- **Following Topics**: Get notified of updates
- **User Profiles**: Link to member profiles
- **Activity Feed**: Recent activity
- **Topic Tags**: Additional categorization

## Best Practices

1. **Clear Titles**: Use descriptive topic titles
2. **Stay On Topic**: Keep discussions relevant
3. **Be Respectful**: Maintain community guidelines
4. **Use Categories**: Post in appropriate categories
5. **Search First**: Check if topic already exists

## Content Guidelines

### Acceptable Content
- Community discussions
- Questions and answers
- Sharing experiences
- Support requests
- Constructive feedback

### Unacceptable Content
- Spam or promotional content
- Offensive language
- Personal attacks
- Off-topic discussions
- Duplicate topics

---

*"In conversation, we find connection. In discussion, we find truth. In community, we find ourselves."*
