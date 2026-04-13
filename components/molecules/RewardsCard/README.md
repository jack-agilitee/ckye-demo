# RewardsCard

## Overview

Molecule-level card component that displays a CPG brand reward offer. Renders in two variants: `activated` (shows punch-card progress toward earning the reward) and `explore` (prompts the user to activate the offer). Used in rewards listing and detail surfaces.

## Figma Reference

- **Design URL**: [RewardsCard in Figma](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/%F0%9F%95%B3%EF%B8%8F-Rewards-Phase-2?node-id=16458-15805)
- **Jira**: CKYE-31
- **Last Updated**: 2026-04-13

## Installation

```tsx
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';
```

## Basic Usage

```tsx
<RewardsCard
  variant="activated"
  brandLogoSrc="/rewards-card/cheetos-logo.png"
  backgroundImageSrc="/rewards-card/cheetos-background.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
  purchasedCount={2}
  requiredCount={5}
  onClick={() => console.log('Card clicked')}
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'activated' \| 'explore'` | — | Yes | Controls layout: punch-card tracker vs. Activate button |
| `brandLogoSrc` | `string` | — | Yes | Path to brand logo image (48x30px) |
| `backgroundImageSrc` | `string` | — | Yes | Path to card background image |
| `description` | `string` | — | Yes | Offer copy displayed at the bottom of the card |
| `expirationDate` | `string` | — | Yes | Expiration date string, e.g. `"12/31/26"` |
| `purchasedCount` | `number` | `0` | No | Number of items already purchased; `activated` variant only |
| `requiredCount` | `number` | `0` | No | Total items required to earn the reward; `activated` variant only |
| `bankedRewards` | `number` | `0` | No | When `> 0`, renders a white count badge (e.g. `+2`) beside the punch circles |
| `onActivate` | `() => void` | — | No | Called when the Activate button is clicked; `explore` variant only |
| `onClick` | `() => void` | — | No | Called when the card itself is clicked |

## Examples

### Activated — partial progress

```tsx
<RewardsCard
  variant="activated"
  brandLogoSrc="/rewards-card/cheetos-logo.png"
  backgroundImageSrc="/rewards-card/cheetos-background.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
  purchasedCount={2}
  requiredCount={5}
  onClick={() => console.log('Card clicked')}
/>
```

### Explore (unactivated)

```tsx
<RewardsCard
  variant="explore"
  brandLogoSrc="/rewards-card/cheetos-logo.png"
  backgroundImageSrc="/rewards-card/cheetos-background.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
  onActivate={() => console.log('Activated!')}
/>
```

### Activated with banked rewards

```tsx
<RewardsCard
  variant="activated"
  brandLogoSrc="/rewards-card/cheetos-logo.png"
  backgroundImageSrc="/rewards-card/cheetos-background.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
  purchasedCount={3}
  requiredCount={5}
  bankedRewards={2}
  onClick={() => console.log('Card clicked')}
/>
```

## Variants

### `activated`

Renders a punch-card tracker in the top bar: a row of filled/empty SVG circles followed by an "X of Y Purchased" label. When `bankedRewards > 0`, an additional white pill badge (e.g. `+2`) appears to the right of the circles. Requires `purchasedCount` and `requiredCount` to be set; the tracker is suppressed when `requiredCount` is `0`.

### `explore`

Replaces the punch tracker with a yellow "Activate" button. The button's click event is stopped from propagating to the card, so `onActivate` and `onClick` fire independently.

## Layout

The card maintains a fixed `343:217` aspect ratio and is `position: relative`. Content is layered with z-index:

| Layer | Element |
|-------|---------|
| 0 | Background image (full bleed, `object-fit: cover`) |
| 1 | Top bar — logo, tracker/activate button, Rewards badge |
| 1 | Bottom content — description, expiry row |

## Accessibility

- The card root has `role="article"`.
- When `onClick` is provided, the card receives `tabIndex={0}` and a `keyDown` handler that activates on `Enter` and `Space`.
- The Activate button has `aria-label="Activate reward"`.
- The brand logo has `alt="Brand logo"`.
- Background image and all decorative icons (star, clock, punch circles) use descriptive alt text (`"Purchased"` / `"Remaining"`) or empty `alt=""` as appropriate.

## Public Assets

All assets live in `public/rewards-card/`:

| File | Usage |
|------|-------|
| `cheetos-background.png` | Sample card background |
| `cheetos-logo.png` | Sample brand logo |
| `punch-circle-filled.svg` | Filled punch-card circle |
| `punch-circle-empty.svg` | Empty punch-card circle |
| `rewards-star.svg` | Rewards badge icon (top-right of card) |
| `clock-icon.svg` | Expiration row icon |

## Design Tokens

From `styles/_variables.scss`:

| Token | Used for |
|-------|----------|
| `$white`, `$black` | Text colors, banked badge |
| `$border-color` | Card border |
| `$font-family-primary` | All text |
| `$font-weight-medium/semibold/bold` | Tracker label / badge & expiry / description |
| `$font-size-xs/sm/md/lg` | Expiry / tracker label / badge & activate btn / description |
| `$spacing-2xs/xs/sm/md/lg` | Internal gaps, padding, positioning |
| `$shadow-card` | Card drop shadow |
| `$shadow-text` | Text and expiry row shadow |

Component-local tokens (defined in the SCSS file, not in the design system):

| Token | Value | Usage |
|-------|-------|-------|
| `$color-activate-yellow` | `#ffd500` | Activate button background |
| `$color-activate-yellow-hover` | `darken(#ffd500, 10%)` | Activate button hover |
| `$radius-card` | `12px` | Card and banked badge border-radius |
| `$radius-btn` | `8px` | Activate button border-radius |

## Related Components

- Likely consumed by a rewards list organism or a rewards detail template.
