# RewardsCard

## Overview

A loyalty punch-card molecule that displays a CPG brand's reward offer with progress tracking. It renders a full-bleed branded background image overlaid with a punch-circle progress tracker, reward description, expiration date, and an optional banked rewards indicator. Used in rewards lists and detail views.

- **Atomic level**: Molecule
- **Jira**: CKYE-31
- **Figma**: [Rewards Phase 2 — node 16458-15805](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/%F0%9F%95%B3%EF%B8%8F-Rewards-Phase-2?node-id=16458-15805&m=dev)

## Installation

```tsx
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';
```

## Basic Usage

```tsx
<RewardsCard
  backgroundImageUrl="/images/cheetos-bg.jpg"
  brandLogoUrl="/images/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={2}
  expirationDate="12/31/26"
  onClick={() => router.push('/rewards/cheetos')}
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `backgroundImageUrl` | `string` | — | Yes | Full-bleed CPG background image URL passed to Next.js `Image` |
| `brandLogoUrl` | `string` | — | Yes | CPG brand logo URL; rendered at 48x30px with `objectFit: contain` |
| `rewardDescription` | `string` | — | Yes | Offer copy, e.g. "Buy 5 Cheetos products to earn 1 for 1¢"; clamped to 2 lines |
| `totalPunches` | `number` | — | Yes | Total qualifying purchases required to complete the offer |
| `completedPunches` | `number` | — | Yes | Number of qualifying purchases already made |
| `expirationDate` | `string` | — | Yes | Display string shown in the expiration pill, e.g. `"12/31/26"` |
| `bankedRewards` | `number` | — | No | When provided and greater than 0, shows a banked rewards indicator below the punch tracker |
| `onClick` | `() => void` | — | No | Click handler; when provided the card renders with `role="button"` and is keyboard accessible |

## Examples

### Basic — card with progress

```tsx
<RewardsCard
  backgroundImageUrl="/images/cheetos-bg.jpg"
  brandLogoUrl="/images/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={2}
  expirationDate="12/31/26"
  onClick={() => console.log('card clicked')}
/>
```

### With banked rewards

When a previous offer cycle completed, pass `bankedRewards` to surface the indicator pill below the punch tracker.

```tsx
<RewardsCard
  backgroundImageUrl="/images/doritos-bg.jpg"
  brandLogoUrl="/images/doritos-logo.png"
  rewardDescription="Buy 4 Doritos bags, get 1 free"
  totalPunches={4}
  completedPunches={1}
  expirationDate="06/30/26"
  bankedRewards={3}
  onClick={() => console.log('card clicked')}
/>
```

### All punches completed

```tsx
<RewardsCard
  backgroundImageUrl="/images/lays-bg.jpg"
  brandLogoUrl="/images/lays-logo.png"
  rewardDescription="Buy 5 Lay's bags to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={5}
  expirationDate="03/31/26"
  onClick={() => console.log('redeem reward')}
/>
```

### Display-only (no click handler)

Omitting `onClick` renders the card as a plain `<article>` with no interactive role — suitable for summary or preview contexts.

```tsx
<RewardsCard
  backgroundImageUrl="/images/cheetos-bg.jpg"
  brandLogoUrl="/images/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={2}
  expirationDate="12/31/26"
/>
```

## Layout

The card is fixed to a **343x216px aspect ratio** (`aspect-ratio: 343/216`) with `max-width: 343px`. All internal elements are absolutely positioned over the background image:

- **Top row** (11px from top, 295px wide): brand logo | punch tracker + labels | rewards badge
- **Bottom content** (17px from bottom, 177px wide): reward description (2-line clamp) + expiration pill

The background image is decorative (`alt=""`, `aria-hidden`) and relies on text-shadow (`$shadow-text`) for legibility of white overlaid text.

## SVG Assets

Required files in `public/rewards-card/`:

| File | Usage |
|------|-------|
| `punch-circle-filled.svg` | Completed punch indicator (16x16) |
| `punch-circle-empty.svg` | Incomplete punch indicator (16x16) |
| `rewards-icon.svg` | Badge icon in top-right (16x16) |
| `clock-icon.svg` | Expiration pill icon (14x14) |

## Accessibility

- The root `<article>` receives `role="button"` and `tabIndex={0}` only when `onClick` is provided.
- `aria-label` on the root element is set to `rewardDescription`, giving screen readers a meaningful label for the interactive card.
- The punch group renders as `role="list"` with each circle as `role="listitem"` and `aria-label` of `"Purchased"` or `"Not yet purchased"`.
- The expiration container carries `aria-label="Expires {expirationDate}"`.
- All decorative images use `alt=""` and `aria-hidden="true"`.

### Keyboard navigation

Applies only when `onClick` is provided:

| Key | Action |
|-----|--------|
| `Tab` | Focus the card |
| `Enter` | Trigger `onClick` |
| `Space` | Trigger `onClick` |

Focus state uses a white `outline` defined by `$focus-ring-width` / `$focus-ring-offset` variables (`:focus-visible` only).

## Styling

SCSS Modules with BEM. Key classes:

| Class | Element |
|-------|---------|
| `.rewards-card` | Root `<article>` |
| `.rewards-card__background` | Full-bleed `Image` |
| `.rewards-card__top-row` | Flex row containing logo, tracker, badge |
| `.rewards-card__logo-wrapper` | 48x30 logo container |
| `.rewards-card__tracker` | Column holding punch group + labels |
| `.rewards-card__punch-group` | Row of punch circle icons |
| `.rewards-card__punch-circle` | Individual circle wrapper |
| `.rewards-card__tracker-label` | "X of Y Purchased" text |
| `.rewards-card__banked` | Banked rewards pill (conditional) |
| `.rewards-card__badge` | Top-right "Rewards" badge |
| `.rewards-card__content` | Bottom description + expiration block |
| `.rewards-card__description` | Offer copy paragraph |
| `.rewards-card__expiration` | Clock icon + date row |

## Related Components

- Rewards list page organism that renders a collection of `RewardsCard` items
