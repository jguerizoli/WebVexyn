# Vexyn Project Context

## Glossary

### Results Section
The architectural module responsible for delivering social proof. It sequences the visual arrival of `ResultCard` objects using a pinned scroll-driven timeline.

### ResultCard
A **Deep Module** representing a single testimonial.
- **Interface**: Consumes a `Review` data object and exposes an animation contract via data-attributes.
- **Invariants**: Must maintain its own hover state and visual integrity regardless of its position in the parent stack.
- **Depth**: Hides the internal complexity of its layout (quotes, metrics, author) from the parent orchestrator.

### Animation Contract
The agreed-upon set of selectors/attributes that a parent component uses to animate a child module. In the Results section, the `ResultCard` exposes its root container for the "Fan-out" movement.

## Typographic Standards (Swiss Grid)
All textual elements must adhere to the mathematical ratios of the Swiss Style to ensure architectural hierarchy.
- **Headlines**: `Outfit` (Black 900).
- **Body**: `Geist Sans` (Light 300).
- **Mono/Technical**: `Geist Mono` (Medium 500 / Bold 700).
- **Hero/Section Titles**: `clamp(3.5rem, 8vw, 6rem)` (~42pt to 72pt).
- **Body Text**: `1rem` (12pt).
- **Secondary/Metadata**: `0.8rem` (~9.6pt).
- **Card Titles**: `clamp(2.5rem, 5.5vw, 4.5rem)` (~30pt to 54pt).
- **Constraint**: Avoid "middle-ground" font sizes. Stick to the 12pt base or the large display sizes to maintain "Brutalismo Chic" tension.
