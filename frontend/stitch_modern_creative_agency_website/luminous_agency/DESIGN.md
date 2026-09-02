---
name: Luminous Agency
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4b4549'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7c757a'
  outline-variant: '#cdc4c9'
  surface-tint: '#655c63'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#201920'
  on-primary-container: '#8b8189'
  inverse-primary: '#cfc3cc'
  secondary: '#526600'
  on-secondary: '#ffffff'
  secondary-container: '#c4f00d'
  on-secondary-container: '#556a00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#181a2e'
  on-tertiary-container: '#81829b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ecdfe8'
  primary-fixed-dim: '#cfc3cc'
  on-primary-fixed: '#201920'
  on-primary-fixed-variant: '#4d444c'
  secondary-fixed: '#c7f314'
  secondary-fixed-dim: '#aed500'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#3d4d00'
  tertiary-fixed: '#e0e0fd'
  tertiary-fixed-dim: '#c4c4e0'
  on-tertiary-fixed: '#181a2e'
  on-tertiary-fixed-variant: '#43455c'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  electric-lime: '#D2FF28'
  deep-onyx: '#110B11'
  muted-indigo: '#393B51'
  off-white: '#F3F3F3'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  button:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is engineered for a high-end digital agency and SaaS environment. It balances technical precision with high-impact creative expression. The personality is confident, forward-thinking, and meticulously organized.

The aesthetic follows a **Modern Agency** style characterized by:
- **Generous Whitespace:** Large breathability between sections to emphasize premium quality.
- **Micro-interactions:** Subtle transitions and soft depth to create a tactile digital experience.
- **High Contrast:** Deep charcoal tones paired with high-vibrancy accents to drive user focus and action.
- **Structure:** A rigorous grid system that maintains order even with experimental layouts.

## Colors

The palette is built on a high-contrast foundation. **Deep Onyx** serves as the primary driver for typography and structural elements, providing a sophisticated "dark mode" feel even within a light-themed system. 

**Electric Lime** is the signature accent color, used exclusively for primary calls to action, highlights, and critical interactive states. Its high luminosity ensures immediate visual hierarchy. 

**Muted Indigo** is utilized for secondary information, borders, and icon backgrounds to provide depth without competing with the primary brand colors. The background relies on pure white and **Off-White** to delineate content zones cleanly.

## Typography

This design system uses a pairing of **Hanken Grotesk** for headlines and **DM Sans** for body copy. 

- **Headlines:** Set with tight letter-spacing and heavy weights to create a "poster" effect. Large display sizes should use "Deep Onyx" for maximum impact.
- **Body:** DM Sans provides exceptional readability at various scales. Line heights are intentionally generous (1.6x - 1.8x) to facilitate scanning in long-form agency case studies or SaaS documentation.
- **Labels:** Small caps with increased letter spacing are used for "overlines" above headlines to provide context without adding visual noise.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **single-column vertical stack** for mobile. 

- **Rhythm:** An 8px base unit governs all spacing.
- **Sectioning:** Vertical gaps between major content blocks are aggressive (120px+) to maintain the "Modern Agency" aesthetic of openness.
- **Alignment:** Content is generally center-aligned within containers, but utilizes asymmetrical offsets for image/text pairings to create dynamic visual interest.
- **Padding:** Internal card padding should never be less than 32px to ensure content feels encapsulated and premium.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** and **Tonal Layering** rather than traditional heavy gradients.

- **Surface Tiers:** Level 0 is pure White. Level 1 (Cards) uses a subtle border of `rgba(17, 11, 17, 0.05)` and an extremely diffused shadow: `0 20px 40px rgba(0, 0, 0, 0.04)`.
- **Hover States:** Elements should lift slightly on hover (Y-axis translation) with the shadow becoming more diffused and a subtle increase in the shadow's spread.
- **Glass Effects:** For navigation bars and floating overlays, use a backdrop-blur (12px) with a semi-transparent White (80% opacity) to maintain context of the background content.

## Shapes

The shape language is primarily **Rounded**, creating a friendly but professional feel. 

- **Cards & Containers:** Use a 16px (1rem) radius.
- **Interactive Elements:** Buttons and tags use a **Pill-shaped** (full-round) treatment to distinguish them clearly from layout containers.
- **Inputs:** Form fields should use a 12px radius to sit comfortably between the softness of buttons and the structure of cards.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with `Electric Lime`, and feature `Deep Onyx` text. Secondary buttons are outlined with a 2px `Deep Onyx` stroke.
- **Cards:** White backgrounds with the defined soft shadow. Headlines inside cards should be `headline-md`. Ensure hover states include a subtle scale-up (1.02x).
- **Input Fields:** Use `Off-White` backgrounds with a hidden border that appears as a 2px `Deep Onyx` stroke only on focus.
- **Chips/Badges:** Small pill shapes using `Muted Indigo` at 10% opacity with `Deep Onyx` text for a subtle, categorized look.
- **Lists:** Icon-led lists should use `Electric Lime` for checkmarks to reinforce brand identity through small details.
- **Navigation:** Top-sticky navigation with a blur effect and a minimal `Deep Onyx` text logo.