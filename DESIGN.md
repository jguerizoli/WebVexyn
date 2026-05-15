# Design System Specification

This document defines the visual and interaction standards for the Vexyn platform, focusing on architectural minimalism, high-contrast aesthetics, and structural precision.

## 1. Design Principles

The visual language is rooted in the International Typographic Style (Swiss Grid), prioritizing content hierarchy and structural integrity over decorative elements.

- **Minimalism**: Elimination of non-functional components.
- **Precision**: Strict adherence to mathematical grids and typographic ratios.
- **Contrast**: High visual tension between positive and negative space.

**CORE REQUIREMENT:** Avoid decorative technical artifacts (e.g., coordinates, simulated system labels, or metadata markers). The aesthetic must remain clean and functional.

## 2. Color Palette & Surface Logic

### Primary Colors
- **Main Background**: `#050505` (Deep Black)
- **Brand Accent**: `#E5511A` (Vexyn Orange)
- **Secondary Surface**: `#121212` (Dark Grey)

### Surface Texture
- **Global Grain**: A subtle 2% noise overlay is applied to add material depth to monochromatic surfaces.
- **Negative Space**: Content separation is achieved through white space (voids) rather than borders or lines whenever possible.

## 3. Typography (Swiss Grid)

Typography is treated as a structural element. The system uses a strict hierarchy based on mathematical ratios.

### Font Families
- **Display/Headings**: Outfit (Weight: 900) - Tight tracking (-0.06em), uppercase.
- **Body Content**: Geist Sans (Weight: 300) - Light weight for maximum legibility in manifestos.
- **Technical/Labels**: Geist Mono (Weight: 500/700) - Used for metadata and functional UI elements.

### Hierarchy Ratios
- **Mega Display**: 6rem (72pt) - Primary section headings.
- **Body Standard**: 1rem (12pt) - All descriptive content.
- **Caption/Metadata**: 0.8rem (9.6pt) - Secondary labels and functional text.

## 4. Layout & Spacing

### Grid System
- **Margins**: Consistent 4vw horizontal margins are enforced globally to isolate content blocks.
- **Vertical Gaps**: Standardized vertical spacing (4vw) between major sections to maintain architectural rhythm.

## 5. Motion Design

Animations follow a mechanical, high-performance logic.

- **Transitions**: Preference for step-based or high-speed cubic-bezier transitions (`expo.inOut`). 
- **Linear Logic**: Avoid elastic or bouncy easing. Movement should feel deliberate and controlled.

## 6. UI Components

### Interactive Elements
- **Border Radius**: 0px globally.
- **Shadows**: Hard-edged 4px block shadows for depth.

### Structural Blocks (Cards)
- **Background**: Solid `#050505` with optional subtle top-down gradients.
- **Borders**: 1px ghost borders (5% - 8% opacity) for subtle separation on dark surfaces.
- **Constraints**: No rounded corners. No simulated metadata IDs. Pure content blocks only.

## 7. Guidelines Summary

### Implementation Requirements:
- Use intentional negative space to separate content.
- Lock every element to the structural grid.
- Maintain strict typographic hierarchy (avoid intermediate sizes).

### Prohibited Elements:
- No simulated "tech" decorative labels or coordinates.
- No backdrop blurs or soft-focus effects.
- No rounded UI components.