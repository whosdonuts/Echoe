# Liquid Glass Instructions

This document is the source of truth for the non-Echoes Liquid Glass styling system in Echo.

It is adapted directly from the provided Liquid Glass design guide and should be treated as the implementation standard for future UI work unless explicitly overridden.

## Core Philosophy

The Liquid Glass aesthetic is inspired by premium, modern physical materials: refractive, polished glass over layered atmospheric light.

Key characteristics:

1. Translucency over transparency. Surfaces should not read as flat alpha panels. They should blur, slightly saturate, and refract what sits behind them.
2. Physical lighting. Elements need depth from a specular top-edge highlight, soft tinted drop shadow, and restrained inner lighting.
3. Inner radiance. Glass should have a faint top-centered internal glow so it feels volumetric instead of flat.
4. Fluid motion. Hover, tap, and state changes should feel organic and spring-like rather than linear and abrupt.

## Color Direction For Echo Non-Echoes Tabs

The app should not drift into warm terracotta, peach, beige, clay, or orange-heavy UI washes for non-Echoes surfaces.

The correct direction is:

- cool white / near-white base
- soft midnight-blue atmospheric depth
- cool blue-grey and icy blue refraction
- faint lavender-blue only when needed for dimensionality
- very restrained soft pink only if needed for depth
- crisp dark text above the glass

Terracotta can exist only as a controlled product accent when explicitly required. It should not dominate the shell, cards, nav, segmented controls, or general chrome.

## 1. The Canvas: Atmospheric Refraction Behind Glass

The glass effect only works when there is something subtle behind it to refract.

- Avoid stark white and avoid warm beige or peach-tinted off-white.
- Use a light premium neutral base with restrained atmospheric gradients.
- Prefer very soft radial washes in midnight blue, blue-grey, icy blue, and faint lavender-blue.
- Keep the canvas understated. No loud colorful blobs. No noisy wallpaper. The background should still feel mostly clean and premium.

Recommended canvas behavior:

- Base: near-white neutral
- Top light: soft white radial light
- Secondary atmosphere: very soft blue / blue-grey radial wash
- Optional tertiary atmosphere: faint lavender-blue for depth

## 2. The Glass Material Recipe

To create a standard Liquid Glass container, pill, card, control, or bar, combine the following:

### A. Base Layer

- Fill: `bg-white/8` to `bg-white/12` feel
- Blur: `backdrop-blur-[24px]` to `backdrop-blur-[28px]`
- Optional saturation lift: `backdrop-saturate-[140%]` to `180%`
- Shape: generous radii, usually pill or rounded 28-30px
- Overflow hidden so the inner glow stays contained

### B. Edge Highlights

- Border: `border border-white/20` to `border-white/30`
- Keep the edge crisp and light. Avoid dark outlines and muddy strokes.

### C. Shadows And Depth

Use a compound shadow:

1. Tinted depth shadow, biased cooler rather than warm:
   `0 8px 32px rgba(73,95,132,0.12)` or similar
2. Inset top highlight:
   `inset 0 1px 0 rgba(255,255,255,0.35)`

The shadow should feel atmospheric and premium, not dense or grey.

### D. Inner Glow

Glass needs volume. Add a very soft inner radial glow:

```tsx
<div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_50%)] pointer-events-none" />
```

For Echo non-Echoes surfaces, a second restrained cool glow can be layered underneath:

```tsx
<div className="absolute inset-0 rounded-[30px] bg-[radial-gradient(ellipse_at_50%_100%,rgba(141,168,219,0.12)_0%,transparent_70%)] pointer-events-none" />
```

## 3. Typography

Because glass sits over atmospheric color, text must stay crisp and readable.

- Primary text: deep integrated darks like `#202733` instead of stark black
- Secondary text: cool softened greys
- Avoid muddy brown text on non-Echoes glass
- Headings should remain clear, confident, and not over-decorated

## 4. Motion

Interactions should feel fluid, physical, and restrained.

- Hover lift: subtle scale and brightness lift
- Tap: slight compression
- Transitions: prefer spring-like curves over flat linear easing
- Glass controls should feel like they catch light when activated

## 5. Bottom Taskbar Standard

The bottom taskbar should remain:

- icon-only
- fixed-slot
- non-shifting
- pill-shaped
- liquid-glass

Rules:

- no visible labels in the bottom nav
- equal fixed tab slots
- active state must not resize the slot
- active state should be communicated through inner capsule treatment, icon emphasis, and subtle indicator treatment only
- use the same glass family as the top segmented bar

## 6. Top Segmented Control Standard

The top segmented bar should belong to the same family as the bottom nav:

- same sheer white glass fill
- same blur range
- same white edge highlight
- same cool tinted shadow family
- same inner top glow
- active segment should feel selected without becoming heavy, clunky, or overly saturated

Avoid flat peach/orange capsules and avoid hard opaque pills that break the glass language.

## 7. Echo Scope Rule

These instructions are for the non-Echoes system unless explicitly requested otherwise.

Do not apply this document to EchoScreen orb logic, haze logic, snapping, or layout mechanics without direct instruction.
