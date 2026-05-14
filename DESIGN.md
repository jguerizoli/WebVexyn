# Design System Document: Brutalismo Chic (Pure Form)

## 1. Overview & Creative North Star: "Brutalismo Chic"
This system is the intersection of raw industrial form and high-fashion editorial precision. It is a **Digital Couture Gallery**. 

**CRITICAL RULE:** We reject "Fake Tech" decorative noise. Do NOT use coordinates, technical labels (`REF. //`), system version markers, or simulated metadata. The aesthetic must remain clean, surgical, and pure, relying on architectural form and spacing rather than decorative "technical" artifacts.

---

## 2. Colors & Surface Logic: The High-Contrast Void
The palette remains disciplined: **Abismo Black (#050505)** and **Arancio Argos (#E5511A)**. 

### The "No-Line" Rule (Pure)
Lines do not exist unless they are structural. Separation is achieved through **Architectural Voids** (large black space). 

### Materiality & Texture
- **The Void:** `#050505` is the primary material.
- **The Signature Noise:** A very subtle 2-3% "Technical Grain" overlay ensures the surface has the "tooth" of premium paper.

---

## 3. Typography: Authority & Restraint (Swiss Grid)
Brutalismo Chic uses typography as a structural material, following the mathematical ratios of the International Typographic Style (Swiss Grid).

- **Display (Outfit Black 900):** Heavy, All-Caps, and tight tracking (-0.06em). It should feel carved into the void.
- **Body/Manifesto (Geist Sans 300):** Light and surgical. Used for manifestos and content text.
- **Technical/Data (Geist Mono 500/700):** Functional and authoritative. Used for technical labels and architecture.
- **Hierarchy Ratios:**
    - **72pt (6rem):** The "Mega-Display" for major headings.
    - **12pt (1rem):** The "Standard Body" for all content text.
    - **9.6pt (0.8rem):** The "Caption/Metadata" for labels and secondary info.
- **The Tension Rule:** We avoid intermediate font sizes. The design relies on the brutal contrast between massive titles and surgical body text.

---

## 4. Architectural Spacing: The Intentional Void
Spacing is our primary design tool.
- **The 10% Rule:** Use massive side margins (minimum 10vw) to isolate content.
- **Balance:** Achieve balance through weight and position, never symmetry.

---

## 5. Kinetic Precision: The Surgical Shutter
Animations must feel mechanical and precise.
- **The Shutter Cut:** Use `step-end` or `power4.inOut`. 
- **No Elasticity:** Precision is key. No bounces.

---

## 6. Components

### Buttons
- **Radius:** 0px. Always.
- **Shadow:** Hard 4px block shadow. 

### Cards: Structural Blocks
- **Visuals:** Integrated `Abismo Black` (#050505) surfaces. 
- **Refinement:** Subtle top-down gradients are allowed to add weight and depth (e.g., from #0a0a0a to #050505).
- **Depth:** Achieved via **2px Ghost Borders** and massive offsets.
- **RESTRICTION:** NO rounded corners (0px only). NO technical IDs or metadata markers. Pure content only.

---

## 7. Do’s and Don’ts

### Do:
- **Use Massive Voids:** Let the black void dominate.
- **Align to a Grid:** Every element must be locked to an invisible structural grid.
- **Sharpness:** 0px corners only.

### Don’t:
- **NO FAKE TECH:** Never use coordinates, `REF //` labels, version numbers, or simulated metadata. These are "decorative noise" and are strictly prohibited.
- **No Blurs:** Never use backdrop-blur or soft effects.
- **No 1px Lines:** If it’s thin, it’s a "Ghost Border" at 5% opacity. 
- **No Transitions:** UI states should "cut" or "snap."
tional grid.