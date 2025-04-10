# VerifiedFolio

[Project Overview](#project-overview)
[Key Features](#key-features)
[Technical Implementation](#technical-implementation)
[Accessibility Features](#accessibility-features)
[Responsive Design](#responsive-design)
[Installation and Usage](#installation-and-usage)
[Contributing](#contributing)
[Future Enhancements](#future-enhancements)
[License](#license)

![Verified Folio Logo](assets/images/logo/verified_folio_navbar_logo_wide.png)

## Project Overview

VerifiedFolio is an innovative platform that bridges the trust gap between professionals and recruiters/clients by showcasing pre-verified portfolios authenticated by industry experts.

Our mission is to:

- Reduce verification costs and time for all parties
- Provide credible proof of work through expert validation
- Eliminate resource waste in portfolio verification processes
- Build trust in professional accomplishments

## Key Features

### Hero Section

- Clear mission statement communicating our value proposition
- Engaging call-to-action for both portfolio owners and verifiers
- Clean, professional design establishing immediate credibility

### Verification Process Infographic

- Visual representation of our 3-step verification workflow:
  1. Portfolio Submission
  2. Expert Review
  3. Verification Badging
- Designed for quick comprehension of our trust-building process

### Featured Work Section

- Showcases top-vetted portfolios with:
  - Responsive project images
  - Verification details (expert name, verification date)
  - Interactive elements (like/bookmark buttons)
- Designed as a "trust gallery" highlighting exemplary work

## Technical Implementation

### HTML Structure

- Semantic HTML5 elements for improved SEO and accessibility
- Bootstrap 5 grid system for responsive layout
- Modular card components for portfolio displays

### CSS Features

- Mobile-first responsive design approach
- Flexible image containers with `object-fit: cover`
- CSS variables for consistent theming
- Optimized media queries for breakpoints at 576px and 768px

### Image Optimization

    ```
        <picture>
        <source media="(max-width: 576px)" srcset="assets/images/small.jpg">
        <source media="(max-width: 768px)" srcset="assets/images/medium.jpg">
        <img src="assets/images/large.jpg" alt="Project example" class="img-fluid">
        </picture>
    ```
    -Responsive image delivery based on viewport size

    -Properly sized assets to reduce bandwidth usage

    -Fallback for older browsers

## Accessibility Features

    -Semantic HTML structure (header, section, article)

    -ARIA attributes for interactive elements (Verified by AI): 
        In web development, ARIA, short for Accessible Rich Internet Applications, is a set of HTML attributes that enhance the accessibility of web content and applications for users with disabilities who use assistive technologies like screen readers. 
    ```
        <button role="button" aria-pressed="false" aria-label="Like this portfolio">
        Like this portfolio
        </button>
    ```
     -Keyboard navigable interface

     -Descriptive alt text for all images

## Responsive Design

| Breakpoint | Layout Adaptation |
|---|---|
| <576px | Single column, optimized touch targets |
| 576-768px | 2-column grid, adjusted typography |
| >768px | 3-column grid, full feature display |

### All components fluidly adapt to screen size while maintaining:

  -Readable text sizes
  -Appropriate touch targets
  -Visual hierarchy

## Installation and Usage

 #To run locally:
    1. Clone repository:
    ```
        https://github.com/repoeli/csshtmlproject.git
    ```

    2. After Installing Python and Run Python3 -m http.server on VS Code Terminal
    3. Open index.html in your browser 

No build process required - pure HTML/CSS implementation.

## Future Enhancements:**

  Continue Building other Features of the Website Project
      
    - **WCAG AA Contrast Compliance for Text Readability:**
        - I will ensure that all text elements on the website meet the Web Content Accessibility  
          Guideline 
            (WCAG) 2.1 Level AA contrast requirements. This means that the contrast ratio between text and background colors is at least 4.5:1 for normal text and 3:1 for large text (14pt bold or 18pt regular).
        - This is verified using automated tools and manual checks to ensure readability for users with 
            low vision or color blindness.

## License

  Any one is free to use this work