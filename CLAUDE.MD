# EF Oposiciones 21 - Project Documentation

## Project Overview

This is a landing page for **EF Oposiciones 21**, a specialized training service for Physical Education teacher competitive exams (oposiciones) in Spain, specifically targeting Castilla-La Mancha and Andalucía regions.

## Purpose

The website serves as a lead generation and information portal for:
- Prospective students preparing for Physical Education teaching positions
- Showcasing the specialized training methodology
- Capturing email leads through a free PDF download
- Facilitating direct contact via WhatsApp

## Technical Stack

- **HTML5**: Semantic markup with Spanish language support
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **Google Fonts**:
  - Montserrat (headings)
  - Lato (body text)
  - Material Symbols (icons)
- **Formspree**: Email form handling (form ID: mzzayqvg)
- **Schema.org**: Structured data for SEO (Organization + Course)

## Project Structure

```
mi-pagina-web/
├── index.html          # Main landing page
└── CLAUDE.MD          # This file
```

## Key Features

### 1. Hero Section
- Main value proposition
- CTA button linking to WhatsApp for interview booking
- WhatsApp number: +34 635 946 732

### 2. Services Section
Three key differentiators:
- Small group sizes (personalized attention)
- Updated curriculum (aligned with latest exam requirements)
- Real exam simulations (detailed corrections)

### 3. Lead Magnet
- Free PDF download: "10 Errores que te Cuestan la Plaza"
- Email capture form integrated with Formspree

### 4. Footer
- Copyright notice
- Instagram social link: @ef_oposiciones21

## Design Elements

### Color Scheme
- Primary: Blue (#3B82F6 - blue-600)
- Accent 1: Amber (#FBBF24 - amber-400)
- Accent 2: Emerald (#34D399 - emerald-400)
- Background: White with gray variations

### Custom SVG Shapes
Three decorative background shapes used for visual interest:
- Diamond pattern (amber)
- Circle pattern (blue)
- Rotated square pattern (emerald)

## SEO & Metadata

- Language: Spanish (es)
- Viewport: Responsive mobile-first
- Structured data for Organization and Course types
- Title optimized for "Preparador de Oposiciones de Educación Física"

## Integration Points

### WhatsApp
- Direct messaging link with pre-filled text in Spanish
- Primary conversion point for consultation bookings

### Instagram
- @ef_oposiciones21
- Social proof and community building

### Formspree
- Form endpoint: https://formspree.io/f/mzzayqvg
- Handles lead magnet email collection

## Development Notes

### Current State
- Single-page application
- No JavaScript beyond Tailwind CDN
- Fully static HTML
- No build process required

### Potential Improvements
- Add analytics tracking (Google Analytics, Meta Pixel)
- Implement cookie consent banner (GDPR compliance)
- Add more testimonials/social proof
- Include success stories from past students
- Add FAQ section
- Create separate thank-you page for form submissions
- Optimize images and consider hosting fonts locally
- Add more detailed course information
- Include pricing/packages section

### Performance Considerations
- Currently loading Tailwind via CDN (consider building custom CSS for production)
- Google Fonts loaded via CDN (could be optimized)
- No image optimization implemented yet
- No lazy loading implemented

## Content Strategy

### Target Audience
- Physical Education teachers preparing for public teaching positions
- Primary regions: Castilla-La Mancha and Andalucía
- Spanish-speaking market

### Value Proposition
1. Specialized methodology
2. Practical approach
3. Small group sizes
4. Real exam simulations
5. Regional expertise

## Business Model

- B2C service (exam preparation)
- Lead generation through free PDF download
- Direct consultation booking via WhatsApp
- Likely subscription or course-based revenue model

## Maintenance

### Regular Updates Needed
- Update copyright year
- Keep curriculum information current with exam requirements
- Update testimonials and success stories
- Monitor and respond to form submissions
- Update Instagram content and links

### Technical Maintenance
- Check Formspree integration functionality
- Monitor CDN availability
- Test responsive design on new devices
- Validate links (WhatsApp, Instagram, Formspree)

## Contact Information

- **WhatsApp**: +34 635 946 732
- **Instagram**: @ef_oposiciones21
- **Form Email Handler**: Formspree (mzzayqvg)
- **Domain**: www.efoposiciones21.com (referenced in schema)

## Version History

- **Current**: Single-page landing with lead magnet
- Recent git commits show updates to index.html (modifications and updates)

---

*This documentation is maintained for Claude Code and developers working on the EF Oposiciones 21 website.*
