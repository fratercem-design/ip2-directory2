# 🪙 Token System Guide

## Overview
The Cult of Psyche token system rewards community engagement and participation. Users earn tokens through various activities and can track their balance and history.

## Database Setup

### Run the Schema
Execute the SQL schema to create the token tables:

```sql
-- Run this in your Supabase SQL editor
-- File: src/lib/db/tokens_schema.sql
```

This creates:
- `user_tokens` - User token balances
- `token_transactions` - Transaction history
- `token_rewards` - Rewards shop (optional)
- `user_rewards` - User purchases (optional)

## Token Earning Methods

### Current Earning Opportunities

1. **Watch Streams** (`earn_watch_stream`)
   - Amount: 10 tokens per hour
   - Rate limit: Per stream session
   - Trigger: When user watches live stream

2. **Daily Login** (`earn_daily_login`)
   - Amount: 5 tokens
   - Rate limit: Once per day
   - Trigger: User logs in

3. **Follow Streamer** (`earn_follow_streamer`)
   - Amount: 25 tokens
   - Rate limit: Once per streamer
   - Trigger: User follows a streamer

4. **Create Clip** (`earn_create_clip`)
   - Amount: 15 tokens
   - Rate limit: Per clip
   - Trigger: User creates a clip

5. **Share Content** (`earn_share_content`)
   - Amount: Variable
   - Rate limit: Per share
   - Trigger: User shares content

6. **Ritual Attendance** (`earn_ritual_attendance`)
   - Amount: 50 tokens
   - Rate limit: Per ritual
   - Trigger: User attends special ritual

7. **Community Contribution** (`earn_community_contribution`)
   - Amount: Variable
   - Rate limit: Per contribution
   - Trigger: Admin/manual award

## API Endpoints

### Get Balance
```
GET /api/tokens/balance
```
Returns user's current token balance, total earned, and total spent.

### Earn Tokens
```
POST /api/tokens/earn
Body: {
  amount: number,
  transaction_type: string,
  description?: string,
  metadata?: object
}
```
Awards tokens to the user. Includes rate limiting to prevent spam.

### Get History
```
GET /api/tokens/history?limit=50&offset=0
```
Returns user's transaction history.

### Get Leaderboard
```
GET /api/tokens/leaderboard?limit=100
```
Returns top token holders (public endpoint).

## Integration Examples

### Award Tokens for Following
```typescript
// In follow-button.tsx after successful follow
await fetch("/api/tokens/earn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        amount: 25,
        transaction_type: "earn_follow_streamer",
        description: `Followed ${streamerName}`,
        metadata: { streamer_id: streamerId }
    })
});
```

### Award Tokens for Creating Clip
```typescript
// In clip-button.tsx after successful clip
await fetch("/api/tokens/earn", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        amount: 15,
        transaction_type: "earn_create_clip",
        description: `Clipped from ${streamTitle}`,
        metadata: { clip_id: clipId, stream_id: streamId }
    })
});
```

### Award Daily Login Bonus
```typescript
// On user login or page load (once per day)
const lastLogin = localStorage.getItem("lastTokenLogin");
const today = new Date().toDateString();

if (lastLogin !== today) {
    await fetch("/api/tokens/earn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            amount: 5,
            transaction_type: "earn_daily_login",
            description: "Daily login bonus"
        })
    });
    localStorage.setItem("lastTokenLogin", today);
}
```

## Token Display Components

### TokenDisplay Component
Use the `TokenDisplay` component to show token balance:

```tsx
import { TokenDisplay } from "@/components/tokens/token-display";

// Compact version (for nav)
<TokenDisplay compact />

// Full version (for profile)
<TokenDisplay />
```

## Pages

### Token Balance Page
- **Route**: `/me/tokens`
- Shows balance, earning methods, transaction history
- Accessible from user profile

### Leaderboard Page
- **Route**: `/tokens/leaderboard`
- Shows top token holders
- Publicly accessible

## Customization

### Token Amounts
Edit the amounts in:
- API route documentation
- Token earning calls
- UI display text

### New Earning Methods
1. Add new transaction type to schema
2. Update Zod schema in `/api/tokens/earn`
3. Add UI/trigger for earning
4. Update documentation

### Rewards Shop (Future)
The schema includes `token_rewards` and `user_rewards` tables for a future shop where users can spend tokens on:
- Badges
- Titles
- Special features
- Physical/digital rewards

## Rate Limiting

The earn endpoint includes rate limiting:
- Most actions: 1 per minute
- Watch stream: Continuous (tracks time)
- Daily login: Once per day (check client-side)

## Security

- All endpoints require authentication
- Users can only see their own transactions
- Balance updates are atomic (via database trigger)
- Rate limiting prevents abuse
- Transaction history is immutable

## Future Enhancements

- Token shop/rewards system
- Token transfers between users
- Special event multipliers
- Token-based features/unlocks
- Integration with live stream events
- Automated earning for stream watching time

---

*The token system encourages engagement and rewards active community members.*
