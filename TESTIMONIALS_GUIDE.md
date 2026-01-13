# 💬 Member Testimonials Guide

## Overview
The testimonials system allows members to share their experiences with the Cult of Psyche community. Testimonials are moderated and can be featured prominently.

## Features

### For Members
- **Submit Testimonials**: Share your experience (10-1000 characters)
- **Optional Rating**: 1-5 star rating
- **Tags**: Categorize testimonials (community, divination, streams, etc.)
- **Status Tracking**: See if your testimonial is pending, approved, or rejected
- **Edit Pending**: Edit testimonials before they're approved

### For Admins
- **Moderation**: Approve or reject testimonials
- **Featured Testimonials**: Highlight special testimonials
- **Admin Notes**: Add notes for rejected testimonials
- **Tag Management**: Organize testimonials by category

### Public Display
- **Featured Section**: Prominently display featured testimonials
- **Filter by Tag**: Browse testimonials by category
- **Rating Display**: Show star ratings
- **Member Profiles**: Link to member profiles

## Database Schema

### Tables

#### `testimonials`
Stores member testimonials:
- `user_id`: Member who wrote the testimonial
- `display_name`: Optional override (defaults to profile name)
- `testimonial`: The testimonial text (10-1000 characters)
- `rating`: Optional 1-5 star rating
- `is_approved`: Whether testimonial is approved
- `is_featured`: Whether testimonial is featured
- `status`: pending, approved, rejected
- `admin_notes`: Admin notes (not visible to user)

#### `testimonial_tags`
Categorizes testimonials:
- `testimonial_id`: Reference to testimonial
- `tag`: Category tag (community, divination, streams, philosophy, growth, support, rituals)

### Run Schema
Execute `src/lib/db/testimonials_schema.sql` in Supabase SQL editor.

## API Endpoints

### Get Testimonials
```
GET /api/testimonials?featured=true&tag=divination&limit=50&offset=0
```
Returns approved testimonials.

**Query Parameters:**
- `featured`: Show only featured testimonials (true/false)
- `tag`: Filter by tag
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset (default: 0)

### Create Testimonial
```
POST /api/testimonials
Body: {
  testimonial: string (10-1000 chars),
  rating?: number (1-5),
  display_name?: string,
  tags?: string[]
}
```

### Get My Testimonials
```
GET /api/testimonials/my
```
Returns current user's testimonials (all statuses).

## User Flow

### Submitting a Testimonial
1. Navigate to `/testimonials`
2. Click "Share Your Experience"
3. Write testimonial (10-1000 characters)
4. Optionally add rating (1-5 stars)
5. Optionally set display name
6. Optionally add tags
7. Submit testimonial
8. Status: "pending" (awaiting review)

### Viewing Testimonials
1. Navigate to `/testimonials`
2. See featured testimonials at top
3. Filter by tag or view all
4. Browse all approved testimonials
5. See ratings, tags, and member info

### Testimonial Status
- **Pending**: Awaiting admin review
- **Approved**: Published and visible
- **Rejected**: Not published (with admin notes)

## Tags

Available tags:
- `community`: Community experience
- `divination`: Divination system
- `streams`: Live streams
- `philosophy`: Philosophical aspects
- `growth`: Personal growth
- `support`: Support received
- `rituals`: Ritual experiences

## Moderation

### Approval Process
1. Member submits testimonial
2. Status: "pending"
3. Admin reviews testimonial
4. Admin approves or rejects
5. If approved: Status: "approved", `is_approved: true`
6. If rejected: Status: "rejected", admin notes added

### Featured Testimonials
- Admins can mark testimonials as featured
- Featured testimonials appear prominently
- Shown at top of testimonials page
- Limited to 3 featured testimonials

## Design Features

### Testimonial Cards
- Quote icon
- Testimonial text (with quotes)
- Member avatar/initials
- Display name
- Star rating (if provided)
- Tags (if provided)
- Featured badge (if featured)

### Featured Section
- Special gradient background
- Larger display
- Prominent placement
- Star icon indicator

### Filter System
- Tag-based filtering
- "All" option
- Visual active state
- Filter persists during session

## Privacy & Security

### RLS Policies
- Public can read approved testimonials
- Users can read their own testimonials (all statuses)
- Users can create their own testimonials
- Users can update their own pending testimonials
- Users can delete their own testimonials

### Content Guidelines
- 10-1000 character limit
- Admin moderation required
- Admin can add notes for rejected testimonials
- One approved testimonial per user (can update pending)

## Future Enhancements

### Advanced Features
- **Testimonial Replies**: Allow responses to testimonials
- **Helpful Votes**: Members can mark testimonials as helpful
- **Testimonial Search**: Search testimonials by keyword
- **Sort Options**: Sort by date, rating, helpful votes
- **Testimonial Images**: Allow image attachments
- **Video Testimonials**: Support video testimonials

### Admin Features
- **Bulk Actions**: Approve/reject multiple testimonials
- **Analytics**: View testimonial statistics
- **Export**: Export testimonials for marketing
- **Auto-approve**: Option to auto-approve trusted members

### Integration
- **Member Profiles**: Show testimonials on member profiles
- **Homepage**: Display featured testimonials on homepage
- **Email**: Send testimonial submission confirmation
- **Notifications**: Notify when testimonial is approved

## Best Practices

1. **Encourage Honesty**: Authentic testimonials are most valuable
2. **Moderate Carefully**: Review for appropriateness and authenticity
3. **Feature Diversity**: Feature testimonials from different members
4. **Respond to Rejections**: Provide clear feedback when rejecting
5. **Update Regularly**: Keep featured testimonials fresh

## Content Guidelines

### Acceptable Testimonials
- Personal experiences
- Honest feedback
- Constructive criticism
- Positive experiences
- Growth stories

### Unacceptable Content
- Spam or promotional content
- Offensive language
- False information
- Personal attacks
- Off-topic content

---

*"Your words become part of our story. Share your truth, and let it guide others on their path."*
