# RewardCard

## Overview

Molecule-level card component displaying a CPG brand reward offer over a full-bleed branded background image. Supports two variants: **activated** (in-progress punch-card tracker) and **explore** (call-to-action to activate a reward).

## Figma Reference

- **Design URL**: [RewardCard in Figma](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/%F0%9F%95%B3%EF%B8%8F-Rewards-Phase-2?node-id=16458-15805&m=dev)
- **Last Updated**: 2026-04-13

## Installation

```tsx
import RewardCard from '@/components/molecules/RewardCard/RewardCard';
```

## Basic Usage

```tsx
// Activated variant — shows punch-card progress
<RewardCard
  variant="activated"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  purchasedCount={2}
  totalRequired={5}
  bankedRewards={0}
/>

// Explore variant — shows Activate button
<RewardCard
  variant="explore"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  onActivate={() => console.log('Activated!')}
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | `'activated' \| 'explore'` | - | Yes | Controls which UI mode is rendered |
| `backgroundImage` | `string` | - | Yes | URL of the CPG brand background image |
| `brandLogo` | `string` | - | Yes | URL of the CPG brand logo (top-left) |
| `description` | `string` | - | Yes | Reward offer description text |
| `expiresAt` | `string` | - | Yes | Expiration display string, e.g. `"12/31/26"` |
| `purchasedCount` | `number` | `0` | No | Activated only: number of completed purchases |
| `totalRequired` | `number` | `5` | No | Activated only: total purchases needed to earn the reward |
| `bankedRewards` | `number` | `0` | No | Activated only: count shown in the banked rewards pill; hidden when `0` |
| `onActivate` | `() => void` | - | No | Explore only: callback fired when the Activate button is clicked |

## Variants

### Activated

Renders a punch-card progress tracker in the header row between the brand logo and the Rewards badge. Each punch is a 16x16 SVG circle — filled (`punch-circle-checked.svg`) for completed purchases, empty (`punch-circle-empty.svg`) for remaining. A `{purchasedCount} of {totalRequired} Purchased` label sits beneath the circles. The bottom section shows the description and an expiry pill with a clock icon.

```tsx
<RewardCard
  variant="activated"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  purchasedCount={3}
  totalRequired={5}
/>
```

### Explore

Hides the punch-card tracker. Replaces the expiry pill with a yellow `Activate` button (`$color-activate-yellow` background, `$black` text). Intended for rewards the user has not yet activated.

```tsx
<RewardCard
  variant="explore"
  backgroundImage="/reward-card/rewards-card-bg-cheetos.png"
  brandLogo="/reward-card/brand-logo-cheetos.png"
  description="Buy 5 Cheetos products to earn 1 for 1¢"
  expiresAt="12/31/26"
  onActivate={handleActivate}
/>
```

## Features

### Banked Rewards Badge

When `bankedRewards > 0`, a pill badge appears below the Rewards badge (top-right) showing the count. Hidden entirely when the value is `0`.

```tsx
<RewardCard
  variant="activated"
  backgroundImage="..."
  brandLogo="..."
  description="..."
  expiresAt="12/31/26"
  bankedRewards={3}
/>
```

### Layout & Sizing

The card maintains a fixed `343:217` aspect ratio via CSS `aspect-ratio`. It is `width: 100%` so it fills its container — size it by controlling the parent element's width.

## Static Assets

All icons are located in `public/reward-card/`:

| File | Usage |
|------|-------|
| `icon-rewards.svg` | Rewards badge icon (top-right header) |
| `icon-clock.svg` | Clock icon inside the expiry pill |
| `punch-circle-checked.svg` | Filled punch circle (purchased step) |
| `punch-circle-empty.svg` | Empty punch circle (remaining step) |

## Design Tokens

| Token | Used On |
|-------|---------|
| `$white` | All text, icons |
| `$black` | Activate button text |
| `$border-color` | Card border |
| `$color-activate-yellow` | Activate button background |
| `$shadow-card` | Card drop shadow |
| `$shadow-text` | Text shadow on description, rewards label, expiry pill, banked badge |
| `$radius-md` | Card border radius |
| `$radius-sm` | Activate button border radius |
| `$radius-xs` | Expiry pill and banked badge border radius |
| `$spacing-2xs` – `$spacing-lg` | Internal padding and gaps |

Typography uses the `heading-3`, `button-text`, and `caption` mixins from `styles/mixins`. The tracker label uses `$font-family-primary`, `$font-weight-medium`, and `$font-size-sm` directly.

## Accessibility

- The root element is a semantic `<article>`.
- The background image has `aria-hidden="true"` and an empty `alt` — it is decorative.
- The brand logo has `alt="Brand logo"`.
- Each punch circle has a descriptive `alt`: `"Purchased"` or `"Remaining"`.
- The Activate button has an explicit `aria-label` scoped to the offer: `"Activate reward: {description}"`.
- The Activate button has a `:focus-visible` outline using `$focus-ring-width` and `$white`, meeting visible keyboard focus requirements.

## Responsive Behavior

The card is `width: 100%` with a locked `343:217` aspect ratio. It adapts to any container width. Place it inside a grid or flex layout to control the displayed size — no internal breakpoints are needed.

## Related Components

- Appears on the Rewards page alongside a list of `RewardCard` instances.
