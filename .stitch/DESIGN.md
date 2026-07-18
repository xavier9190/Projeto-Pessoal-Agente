---
name: Hub Productivity
colors:
  surface-container-highest: '#353434'
  error-container: '#93000a'
  on-tertiary-fixed: '#1e1b18'
  on-surface-variant: '#c8c6cb'
  on-secondary: '#313032'
  secondary-fixed: '#e5e2e4'
  on-error: '#690005'
  surface-dim: '#141313'
  on-tertiary: '#34302c'
  error: '#ffb4ab'
  outline-variant: '#47464a'
  surface-bright: '#3a3939'
  surface-container-low: '#1c1b1b'
  on-primary: '#303032'
  secondary-container: '#474648'
  on-tertiary-fixed-variant: '#4a4642'
  on-tertiary-container: '#69635f'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-container: '#b7b4b6'
  tertiary-container: '#e9e1db'
  surface: '#141313'
  primary-fixed-dim: '#c8c6c9'
  on-background: '#e5e2e1'
  tertiary: '#ffffff'
  on-primary-container: '#656466'
  tertiary-fixed-dim: '#cdc5bf'
  tertiary-fixed: '#e9e1db'
  secondary: '#c8c6c8'
  inverse-on-surface: '#313030'
  on-error-container: '#ffdad6'
  secondary-fixed-dim: '#c8c6c8'
  inverse-primary: '#5f5e61'
  surface-tint: '#c8c6c9'
  primary-container: '#e4e1e4'
  on-primary-fixed-variant: '#474649'
  on-surface: '#e5e2e1'
  on-primary-fixed: '#1b1b1e'
  surface-variant: '#353434'
  surface-container: '#201f1f'
  outline: '#919095'
  surface-container-high: '#2b2a2a'
  on-secondary-fixed-variant: '#474648'
  primary: '#ffffff'
  inverse-surface: '#e5e2e1'
  primary-fixed: '#e4e1e4'
  background: '#141313'
  surface-container-lowest: '#0e0e0e'
typography:
  display-lg:
    fontFamily: Noto Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-md:
    fontFamily: Noto Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  DEFAULT: 0.25rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-gap: 20px
  inner-padding: 24px
  utility-panel-width: 320px
  sidebar-width: 260px
  section-margin: 32px
---

# Design System: Hub Productivity

## 1. Visual Theme & Atmosphere
The brand personality is dark, minimal, and highly focused on productivity. The interface uses a sleek dark mode by default (`class="dark"`), providing a professional workspace that reduces eye strain for power users. The aesthetic relies heavily on glassmorphism panels (`glass-panel`), subtle borders (`outline-variant`), and a structured layout with rigid dimensions to keep tools predictable and accessible.

The design feels "technical" but approachable, utilizing rounded corners (`rounded-2xl` and `rounded-3xl` for main areas) to soften the dark aesthetic. Small, thoughtful interactions (like hover scales and ring outlines on inputs) make the system feel responsive and alive.

## 2. Color Palette & Roles
The color palette relies heavily on the Material Design 3 (M3) token naming convention, adapted for a custom dark theme.

### Primary Foundation
- **Surface**: `#141313` - The deepest background layer, creating the void.
- **Surface Container Lowest/Low/High/Highest**: A rising scale of grays (`#0e0e0e` to `#353434`) used to elevate cards, panels, and chat bubbles above the background.
- **On-Surface / On-Surface-Variant**: `#e5e2e1` and `#c8c6cb` - Primary and secondary text colors, ensuring high contrast without harshness.

### Accent & Interactive
- **Primary**: `#ffffff` - Used for active states, key icons, and the most critical text to create stark contrast against the dark background.
- **Primary Container**: `#e4e1e4` - Used for AI message avatars and highlight backgrounds.
- **Outline / Outline-Variant**: `#919095` and `#47464a` - Crucial for separating areas (sidebars, cards, inputs) in the dark theme.

### Functional States
- **Error**: `#ffb4ab` - Used for negative financial values (e.g., Contas a Pagar).

## 3. Typography Rules
The entire application uses **Noto Sans**, providing a highly legible, utilitarian feel that works across multiple languages and data types (numbers, chat, labels).

### Hierarchy & Weights
- **Display**: High impact (`display-lg` at 40px/600) used for major brand headers (e.g., "Hub").
- **Headline**: Used for section titles and chat headers (`headline-md` at 20px/500).
- **Body**: Standard text for chat and descriptions (`body-md` at 14px and `body-lg` at 16px).
- **Label**: Utility text (12px/500 with tracking) for small UI elements like "HOJE" badges or tiny timestamps.

### Spacing Principles
- The layout relies on strict CSS variables for fixed widths (`sidebar-width: 260px`, `utility-panel-width: 320px`).
- Inner paddings are generous (`p-6`, `p-8`) to give the dense information room to breathe.
- Gaps between flex items are consistent (`gap-3`, `gap-4`).

## 4. Component Stylings

### Navigation Sidebar (Left)
- **Container**: Fixed width, 100vh height, `border-r border-outline-variant`.
- **Items**: Rounded large (`rounded-lg`), with a visible hover state `hover:bg-surface-container-highest`. Active items have a left border indicator (`border-r-2 border-primary` - actually it's a right border in the CSS but styled to look like an indicator) and `bg-surface-container-high`.

### Chat Area (Center)
- **Canvas**: A massive `glass-panel rounded-3xl` taking up all available central space.
- **Bubbles**: AI messages use `glass-panel` and `rounded-tl-none`. User messages use `bg-surface-container-high` and `rounded-tr-none`. Both use `rounded-2xl` for the remaining corners.
- **Input**: A pill-shaped `rounded-xl` input field with `focus:border-primary` interaction.

### Utility Sidebar (Right)
- **Container**: Fixed width, `border-l border-outline-variant`, subtle `bg-surface/50`.
- **Cards (Agendas)**: `glass-panel rounded-2xl` with hover interactions `hover:border-primary/50`.
- **User Avatars**: Overlapping circles (`-space-x-2`) with borders matching the surface background to separate them.

## 5. Layout Principles

### Grid & Structure
The layout is a classic 3-pane holy grail variation:
- **Left**: Fixed 260px (`w-sidebar-width`), fixed `h-screen`.
- **Right**: Fixed 320px (`w-utility-panel-width`), fixed height or full flex column.
- **Center**: `flex-1` fluid space that grows and shrinks, with `min-w-0` to prevent overflow.

### Whitespace Strategy
- The application uses `padding: 24px` (`px-inner-padding`) for the top header.
- Main content areas use `p-6` (24px) for internal padding.
- This creates a framed look where the central glass panel is inset from the edges.

### Alignment & Visual Balance
- Icons and text are strictly aligned using `flex items-center gap-3`.
- The interface feels left-heavy due to the navigation, but is balanced by the right utility panel's density.

## 6. Design System Notes for Stitch Generation

### Language to Use
- "A sleek, dark mode productivity interface with glassmorphism panels."
- "Use subtle, thin borders (#47464a) to separate sections."
- "The design should feel dense but breathable, with 24px padding."
- "Use Noto Sans for all typography."
- "Components should have rounded corners (8px for small, 16px for cards, 24px for major panels)."

### Component Prompts
- **Sidebar**: "A fixed-width sidebar with a list of navigation items. Active item has a bright white highlight, inactive items are muted gray. Items should have 8px rounded corners."
- **Dashboard Grid**: "A grid of financial metric cards. Each card uses a glassmorphism background with a thin gray border and 16px rounded corners. Use a stark white (#ffffff) for positive numbers and a soft red (#ffb4ab) for negative numbers."
- **Data Table**: "A list of recent transactions on a dark surface container. Rows should have subtle hover states. Use small, muted text for dates."

### Incremental Iteration
When iterating, focus on maintaining the `260px` left sidebar and `320px` right sidebar structure. Never bleed central content into these fixed zones.
