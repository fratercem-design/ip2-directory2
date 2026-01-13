# 💰 Token Sales System Guide

## Overview
The token sales system allows users to sell their earned tokens for real money via Cash App, PayPal, Venmo, or other payment methods.

## Features

### User Features
- **Sell Tokens**: Convert tokens to USD at configurable exchange rates
- **Sale History**: View all past sale requests and their status
- **Multiple Payment Methods**: Support for Cash App, PayPal, Venmo, and other methods
- **Token Reservation**: Tokens are reserved when sale is created, preventing double-spending

### Admin Features
- **Configurable Exchange Rate**: Set tokens per dollar (default: 100 tokens = $1)
- **Min/Max Limits**: Set minimum and maximum sale amounts
- **Sale Management**: Approve, reject, or process sales
- **Enable/Disable**: Toggle token sales on/off

## Database Schema

### Tables

#### `token_sales`
Stores all sale requests:
- `user_id`: User making the sale
- `tokens_amount`: Number of tokens being sold
- `sale_price_usd`: Calculated USD amount
- `exchange_rate`: Rate used at time of sale
- `payment_method`: Cash App, PayPal, Venmo, etc.
- `payment_info`: Payment details (tag, email, etc.)
- `status`: pending, approved, processing, completed, rejected, cancelled

#### `token_sale_settings`
Admin-configurable settings:
- `exchange_rate`: Tokens per dollar (default: 100)
- `min_sale_amount`: Minimum tokens to sell (default: 100)
- `max_sale_amount`: Maximum tokens per sale (null = unlimited)
- `is_enabled`: Enable/disable sales globally

### Run Schema
Execute `src/lib/db/token_sales_schema.sql` in Supabase SQL editor.

## API Endpoints

### Create Sale Request
```
POST /api/tokens/sell
Body: {
  tokens_amount: number,
  payment_method: "cashapp" | "paypal" | "venmo" | "other",
  payment_info: string
}
```

### Get Sale Settings
```
GET /api/tokens/sell/settings
```
Returns public sale settings (exchange rate, limits, enabled status).

### Get Sale History
```
GET /api/tokens/sell/history?limit=50&offset=0
```
Returns user's sale history.

## User Flow

1. **User visits `/tokens/sell`**
2. **Views balance and exchange rate**
3. **Enters token amount** (validated against min/max)
4. **Selects payment method** (Cash App, PayPal, etc.)
5. **Enters payment info** (tag, email, etc.)
6. **Submits sale request**
7. **Tokens are reserved** (transaction created with negative amount)
8. **Sale status: pending**
9. **Admin approves sale**
10. **Admin processes payment**
11. **Sale status: completed**
12. **Tokens remain deducted** (already reserved)

## Admin Workflow

### Approving Sales
1. Admin reviews pending sales
2. Verifies user balance (already reserved)
3. Approves sale
4. Processes payment via selected method
5. Marks sale as completed

### Rejecting Sales
1. Admin reviews sale
2. Rejects if needed (fraud, invalid payment info, etc.)
3. Tokens are returned to user (create positive transaction)

## Exchange Rate Calculation

```
sale_price_usd = tokens_amount / exchange_rate
```

Example:
- Exchange rate: 100 tokens = $1
- User sells 500 tokens
- Sale price: $5.00

## Token Reservation

When a sale is created:
1. Negative transaction is created immediately
2. User balance is reduced
3. Sale status is "pending"
4. Tokens are effectively "locked" until sale is processed

If sale is rejected:
1. Positive transaction is created to return tokens
2. User balance is restored

## Security Considerations

### Validation
- Minimum/maximum sale amounts enforced
- Balance check before sale creation
- Duplicate prevention (rate limiting)
- Payment info validation

### Fraud Prevention
- Admin review required
- Transaction audit trail
- User verification
- Payment method verification

## Configuration

### Default Settings
```sql
INSERT INTO token_sale_settings (exchange_rate, min_sale_amount, is_enabled)
VALUES (100.0, 100, true);
```

### Update Exchange Rate
```sql
UPDATE token_sale_settings
SET exchange_rate = 150.0, updated_at = now()
WHERE is_enabled = true;
```

### Disable Sales
```sql
UPDATE token_sale_settings
SET is_enabled = false, updated_at = now();
```

## Future Enhancements

### Automated Processing
- Stripe integration for automatic payments
- PayPal API integration
- Cash App API integration (if available)

### Advanced Features
- Bulk sales
- Scheduled sales
- Sale limits per user (daily/weekly/monthly)
- Referral bonuses
- Sale promotions (bonus rates)

### Admin Dashboard
- Sale management interface
- Bulk approval/rejection
- Payment processing tools
- Analytics and reporting

## Best Practices

1. **Set Reasonable Exchange Rates**: Balance token value with user incentives
2. **Monitor Sales**: Review sales regularly for fraud
3. **Clear Communication**: Inform users of processing times
4. **Payment Verification**: Verify payment methods before approval
5. **Audit Trail**: Keep detailed records of all sales
6. **User Support**: Provide clear instructions and support

## Legal Considerations

- **Tax Reporting**: May need to report sales for tax purposes
- **Terms of Service**: Clearly state sale terms and conditions
- **Refund Policy**: Define refund/return policy
- **Payment Processing**: Comply with payment processor terms
- **User Verification**: May need KYC for larger sales

---

*"Tokens earned through engagement can be converted to value. The exchange is sacred, the process transparent."*
