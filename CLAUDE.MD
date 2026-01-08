# EF Oposiciones 21 - Project Documentation

## Project Overview

This is a landing page website for **EF Oposiciones 21**, a service that prepares candidates for physical education teacher civil service exams (oposiciones) in Spain, specifically for Castilla-La Mancha and Andalucía regions.

## Purpose

The website serves as a lead generation and information platform for prospective students interested in exam preparation services. It showcases the preparation method, services offered, and provides a way for potential students to get in touch.

## Tech Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **Google Fonts**: Montserrat (headings) and Lato (body text)
- **Material Symbols**: Icon library
- **Formspree**: Form handling service for email collection
- **WhatsApp Integration**: Direct contact via WhatsApp link

## Project Structure

```
/home/user/mi-pagina-web/
├── index.html          # Main landing page
└── CLAUDE.MD          # This file
```

## Key Features

### 1. Hero Section
- Clear value proposition
- Call-to-action button linking to WhatsApp contact
- Decorative SVG background shapes

### 2. Services Section
- Three-column grid showcasing:
  - Small group classes (Grupos Reducidos)
  - Updated course materials (Temario Actualizado)
  - Real exam simulations (Simulacros Reales)

### 3. Lead Magnet
- Free PDF download offer: "10 Errores que te Cuestan la Plaza"
- Email collection form integrated with Formspree
- Form endpoint: `https://formspree.io/f/mzzayqvg`

### 4. Footer
- Copyright information
- Instagram social link: `@ef_oposiciones21`

## Contact Information

- **WhatsApp**: +34 635 946 732
- **Instagram**: @ef_oposiciones21
- **Website**: efoposiciones21.com

## Design System

### Typography
- **Headings**: Montserrat (700 weight)
- **Body**: Lato (400, 700 weights)
- **Base font**: Sans-serif fallback

### Color Palette
- **Primary Blue**: #2563EB (Blue-600)
- **Dark Text**: #111827 (Gray-900)
- **Body Text**: #4B5563 (Gray-700)
- **Light Background**: #F9FAFB (Gray-50)
- **Accent Colors**: Yellow (#FBBF24), Blue (#60A5FA), Green (#34D399) for decorative shapes

### Layout
- **Max Width**: 6xl container (1280px)
- **Responsive**: Mobile-first approach using Tailwind breakpoints
- **Sticky Header**: Semi-transparent with backdrop blur

## SEO & Structured Data

The page includes JSON-LD structured data for:
- Organization schema
- Course schema
- Proper meta tags for viewport and charset

## Development Guidelines

### Making Changes

1. **Content Updates**: Edit `index.html` directly
2. **Styling**: Use Tailwind utility classes
3. **Testing**: Open `index.html` in a browser to preview changes
4. **Deployment**: Push changes to the repository

### Code Style

- Use semantic HTML5 elements
- Maintain accessibility (ARIA labels, alt text)
- Keep inline styles minimal (only for custom SVG backgrounds)
- Use Tailwind utility classes for styling
- Maintain responsive design patterns

### Key Sections to Preserve

- Schema.org structured data in `<head>`
- WhatsApp contact link with pre-filled message
- Formspree form endpoint
- Instagram social link

## Future Enhancement Ideas

- Add testimonials section
- Include success rate statistics
- Add FAQ section
- Create separate pages for each region (Castilla-La Mancha, Andalucía)
- Add blog section for exam preparation tips
- Implement analytics tracking
- Add more social media links
- Create a resources section with downloadable materials

## Notes for Claude

- The target audience is Spanish-speaking candidates preparing for physical education teaching positions
- The business model focuses on small group preparation with personalized attention
- The main conversion goals are WhatsApp contact and email collection
- Content should maintain a professional yet approachable tone
- All customer-facing text is in Spanish
