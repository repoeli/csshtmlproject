# Style.css Comments Guide

Below are suggested comments for important CSS selectors and properties in your style.css file. Add these comments before or next to the corresponding CSS rules:

```css
/* 
 * Main Stylesheet for VerifiedFolio
 * Contains custom styles and Bootstrap overrides
 */

/* Root variables for consistent theming across the site */
:root {
  --primary-color: #4e57d4;  /* Primary brand color used for buttons, links, and accents */
  --secondary-color: #2d3047; /* Secondary color for backgrounds and subtle elements */
  --accent-color: #ffad05; /* Accent color for highlights and calls to action */
  --text-color: #333333; /* Main text color for optimal readability */
  --light-color: #f8f9fa; /* Light background for sections */
  --dark-color: #212529; /* Dark background for contrast sections */
  --font-primary: 'Roboto', sans-serif; /* Primary font for body text */
  --font-heading: 'Montserrat', sans-serif; /* Font for headings for visual hierarchy */
  --transition-speed: 0.3s; /* Standard transition timing for animations */
}

/* Global resets and base styles */
body {
  /* Base font settings for entire document */
  font-family: var(--font-primary);
  color: var(--text-color);
  line-height: 1.6; /* Improved readability with increased line height */
  overflow-x: hidden; /* Prevent horizontal scrolling */
}

/* Typography styles for clear content hierarchy */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading); /* Apply heading font to all headings */
  font-weight: 700; /* Bold headings for emphasis */
  margin-bottom: 1rem; /* Consistent spacing after headings */
}

/* Link styling for consistent user experience */
a {
  color: var(--primary-color); /* Brand color for all links */
  text-decoration: none; /* Remove underline for cleaner appearance */
  transition: color var(--transition-speed); /* Smooth color transitions on hover */
}

a:hover {
  color: darken(var(--primary-color), 15%); /* Darken color on hover for feedback */
  text-decoration: underline; /* Add underline on hover for clarity */
}

/* Button styles and overrides */
.btn-primary {
  background-color: var(--primary-color); /* Custom primary button color */
  border-color: var(--primary-color);
  transition: all var(--transition-speed); /* Smooth transitions for hover effects */
}

.btn-primary:hover {
  background-color: darken(var(--primary-color), 10%); /* Darker on hover for feedback */
  border-color: darken(var(--primary-color), 10%);
}

/* Verification badge styling */
.verification-badge {
  background-color: var(--accent-color); /* Distinctive color for verification badges */
  color: white;
  padding: 0.25rem 0.5rem; /* Compact padding for badge */
  border-radius: 4px; /* Slightly rounded corners */
  font-size: 0.8rem; /* Smaller text for badges */
  font-weight: 600; /* Semi-bold for emphasis */
}

/* Hero section styling */
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); /* Gradient background for visual appeal */
  color: white; /* Light text on dark background for contrast */
  padding: 6rem 0; /* Generous padding for prominence */
  position: relative; /* Required for potential overlapping elements */
}

/* Portfolio card styling */
.portfolio-card {
  border-radius: 8px; /* Rounded corners for cards */
  overflow: hidden; /* Ensure no content spills outside rounded corners */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  transition: transform var(--transition-speed), box-shadow var(--transition-speed); /* Animation on hover */
  margin-bottom: 2rem; /* Space between cards */
}

.portfolio-card:hover {
  transform: translateY(-5px); /* Slight lift effect on hover */
  box-shadow: 0 10px 20px rgba(0,0,0,0.15); /* Enhanced shadow on hover */
}

/* Testimonial section styling */
.testimonial {
  background-color: var(--light-color); /* Light background for testimonials */
  border-left: 4px solid var(--primary-color); /* Accent border for visual interest */
  padding: 1.5rem; /* Comfortable padding */
  margin-bottom: 1.5rem; /* Space between testimonials */
  border-radius: 0 8px 8px 0; /* Rounded corners on right side only */
}

/* Form styling and customization */
.custom-form .form-control {
  border-radius: 4px; /* Consistent rounded corners */
  border: 1px solid #ced4da; /* Subtle border */
  padding: 0.75rem; /* Larger clickable area */
  transition: border-color var(--transition-speed), box-shadow var(--transition-speed); /* Smooth transitions */
}

.custom-form .form-control:focus {
  border-color: var(--primary-color); /* Brand color for focused inputs */
  box-shadow: 0 0 0 0.25rem rgba(78, 87, 212, 0.25); /* Subtle glow effect for focus state */
}

/* Footer styling */
.footer {
  background-color: var(--dark-color); /* Dark background for contrast */
  color: white; /* Light text on dark background */
  padding: 3rem 0; /* Generous padding */
}

/* Responsive navigation adjustments */
@media (max-width: 992px) {
  /* Specific adjustments for tablets and smaller devices */
  .navbar-nav {
    padding: 1rem 0; /* Extra padding for touch targets */
  }
  
  .hero-section {
    padding: 4rem 0; /* Reduced padding on smaller screens */
  }
}

@media (max-width: 768px) {
  /* Specific adjustments for mobile devices */
  h1 {
    font-size: 2rem; /* Smaller heading size on mobile */
  }
  
  .portfolio-card {
    margin-bottom: 1.5rem; /* Reduced spacing on mobile */
  }
}

/* Accessibility enhancements */
.visually-hidden {
  position: absolute; /* Remove from normal flow but keep for screen readers */
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Animation classes */
.fade-in {
  animation: fadeIn 1s ease-in-out; /* Fade in animation for content */
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Utility classes for additional flexibility */
.text-primary-custom {
  color: var(--primary-color) !important; /* Custom text color matching brand */
}

.bg-light-custom {
  background-color: var(--light-color) !important; /* Custom light background */
}
```

## How to Use These Comments

1. Copy the comments that match your existing CSS selectors
2. Paste them before or next to the corresponding CSS rules in your style.css file
3. Adjust the comments to match your specific implementation details
4. For CSS properties not covered above, follow the same format: `/* Brief explanation of what this property does */`

## Benefits of CSS Comments

- **Improves Code Maintainability**: Makes it easier for you or other developers to understand the purpose of each style
- **Aids in Debugging**: Helps identify which styles affect specific elements
- **Facilitates Collaboration**: Other team members can quickly understand your styling approach
- **Documentation**: Serves as built-in documentation for your design system
