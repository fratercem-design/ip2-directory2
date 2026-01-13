# 💼 Services Guide

## Overview
The Services page showcases marketing services and tarot reports offered by Cult of Psyche, providing a professional platform for service offerings.

## Services Offered

### Tarot Reports

#### Personal Tarot Reading - $25
- **3-card spread or custom spread**
- **Detailed written interpretation**
- **Shadow work insights**
- **Practical guidance**
- **Digital delivery within 48 hours**

#### Extended Tarot Report - $75
- **Multiple card spreads**
- **Comprehensive written report (5-10 pages)**
- **Timeline analysis**
- **Shadow work integration**
- **Follow-up support**
- **Digital delivery within 72 hours**

#### Monthly Tarot Guidance - $60/month
- **Monthly tarot reading**
- **Month-ahead guidance**
- **Astrological insights**
- **Shadow work themes**
- **Email delivery on 1st of month**
- **3-month minimum commitment**

### Marketing Services

#### Marketing Consultation - $150
- **1-hour consultation call**
- **Brand strategy review**
- **Marketing plan development**
- **Content strategy guidance**
- **Social media recommendations**
- **Follow-up email summary**

#### Marketing Audit & Report - $300
- **Full marketing audit**
- **Competitor analysis**
- **Brand positioning review**
- **Content analysis**
- **Detailed written report (10-15 pages)**
- **30-minute review call**

#### Ongoing Marketing Support - $400/month
- **Monthly strategy sessions**
- **Content planning & review**
- **Performance analysis**
- **Marketing recommendations**
- **Email support**
- **Quarterly reports**

## Page Features

### Service Cards
- **Category-based organization**: Tarot and Marketing sections
- **Feature lists**: Clear breakdown of what's included
- **Pricing**: Transparent pricing display
- **Popular badges**: Highlight popular services
- **Book Now buttons**: Direct email contact

### Design Elements
- **Purple theme**: Tarot services use purple/indigo gradients
- **Blue theme**: Marketing services use blue/indigo gradients
- **Hover effects**: Interactive cards with scale animations
- **Icons**: Visual indicators for each service type
- **Checkmarks**: Feature lists with check icons

### Additional Sections
- **How It Works**: 3-step process explanation
- **Testimonials**: Client reviews and ratings
- **Contact CTA**: Call-to-action for inquiries

## Customization

### Update Services
Edit the `services` array in `src/app/services/page.tsx`:

```tsx
const services: Service[] = [
    {
        id: "your-service",
        title: "Service Name",
        description: "Service description",
        features: ["Feature 1", "Feature 2"],
        price: "$XX",
        category: "tarot" | "marketing",
        icon: <YourIcon />,
        popular: false
    }
];
```

### Update Pricing
Change prices directly in the services array.

### Update Contact Email
Change email in "Book Now" links:
```tsx
href={`mailto:your-email@example.com?subject=Service Inquiry: ${service.title}`}
```

### Add New Categories
1. Add category to `Service` interface
2. Add category colors and icons
3. Filter services by category

## Integration

### Navigation
- "Services" link added to main navigation
- Accessible from all pages

### Email Integration
- All "Book Now" buttons link to email
- Pre-filled subject lines
- Easy for clients to inquire

## Best Practices

### Service Descriptions
- **Clear Value Proposition**: Explain what clients get
- **Specific Features**: List exact deliverables
- **Timeline**: Include delivery timeframes
- **Alignment**: Connect to Cult of Psyche philosophy

### Pricing Strategy
- **Transparent**: Clear pricing display
- **Competitive**: Research market rates
- **Value-Based**: Price reflects value provided
- **Flexible**: Consider package deals

### Client Communication
- **Quick Response**: Respond to inquiries promptly
- **Clear Process**: Explain what to expect
- **Professional**: Maintain professional communication
- **Follow-up**: Check in after service delivery

## Future Enhancements

### Booking System
- **Online Booking**: Calendar integration
- **Payment Processing**: Stripe/PayPal integration
- **Automated Confirmations**: Email confirmations
- **Service Management**: Track bookings and deliveries

### Service Variants
- **Package Deals**: Bundle multiple services
- **Custom Services**: Build-your-own service options
- **Gift Certificates**: Allow gift purchases
- **Subscription Plans**: Recurring service options

### Client Portal
- **Order History**: View past services
- **Service Status**: Track in-progress services
- **Downloads**: Access delivered reports
- **Communication**: Direct messaging

---

*"Service is an offering, a gift of time and expertise. In giving, we receive. In teaching, we learn."*
