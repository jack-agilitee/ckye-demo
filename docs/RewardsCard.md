# RewardsCard

## Overview

`RewardsCard` is a molecule-level component that renders a branded rewards punch card. It combines a full-bleed background image, a top bar with a brand logo, a punch progress tracker, and a "Rewards" label, with a bottom section displaying promotional text and an expiration badge.

The component is stateless and display-only. Interactivity is opt-in via the `onClick` prop, which also activates keyboard and accessibility attributes.

## Figma Reference

- **Design URL**: [Rewards Phase 2 — node 16458-15805](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/Rewards-Phase-2?node-id=16458-15805)
- **Last Updated**: 2026-04-01

## Location

```
components/molecules/RewardsCard/
├── RewardsCard.tsx
├── RewardsCard.module.scss
└── RewardsCard.test.tsx
```

## Installation

```tsx
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';
```

## Basic Usage

```tsx
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

function Example() {
  return (
    <RewardsCard
      backgroundSrc="/images/rewards-card/rewards-card-bg.png"
      logoSrc="/images/rewards-card/logo.png"
      totalPunches={5}
      earnedPunches={2}
      promoText="Buy 5 Cheetos products to earn 1 for 1¢"
      expirationDate="12/31/26"
      onClick={() => console.log('card clicked')}
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `backgroundSrc` | `string` | - | Yes | URL of the full-bleed card background image |
| `logoSrc` | `string` | - | Yes | URL of the brand logo shown in the top-left of the card |
| `totalPunches` | `number` | - | Yes | Total number of punch slots to render |
| `earnedPunches` | `number` | - | Yes | Number of punches already earned; fills slots left to right |
| `promoText` | `string` | - | Yes | Promotional copy displayed in the bottom section of the card |
| `expirationDate` | `string` | - | Yes | Expiration date string displayed in the bottom badge (e.g. `"12/31/26"`) |
| `onClick` | `() => void` | `undefined` | No | Click handler; when provided, the card becomes interactive (`role="button"`, `tabIndex={0}`, keyboard support) |
| `className` | `string` | `''` | No | Additional CSS class appended to the card wrapper |

## TypeScript Interface

```typescript
interface RewardsCardProps {
  /** URL of the full-bleed card background image */
  backgroundSrc: string;
  /** URL of the brand logo image */
  logoSrc: string;
  /** Total number of punch slots */
  totalPunches: number;
  /** Number of punches already earned */
  earnedPunches: number;
  /** Promotional text displayed at the bottom of the card */
  promoText: string;
  /** Expiration date string shown in the expiry badge */
  expirationDate: string;
  /** Optional click handler — enables interactive mode */
  onClick?: () => void;
  /** Additional CSS class name */
  className?: string;
}
```

## Examples

### Static Display (no click handler)

```tsx
<RewardsCard
  backgroundSrc="/images/rewards-card/rewards-card-bg.png"
  logoSrc="/images/rewards-card/logo.png"
  totalPunches={5}
  earnedPunches={3}
  promoText="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
/>
```

### Interactive Card

When `onClick` is provided the card receives `role="button"`, `tabIndex={0}`, and responds to `Enter` and `Space` key presses.

```tsx
<RewardsCard
  backgroundSrc="/images/rewards-card/rewards-card-bg.png"
  logoSrc="/images/rewards-card/logo.png"
  totalPunches={5}
  earnedPunches={2}
  promoText="Buy 5 Cheetos products to earn 1 for 1¢"
  expirationDate="12/31/26"
  onClick={() => router.push('/rewards/cheetos')}
/>
```

### No Punches Earned

```tsx
<RewardsCard
  backgroundSrc="/images/rewards-card/rewards-card-bg.png"
  logoSrc="/images/rewards-card/logo.png"
  totalPunches={5}
  earnedPunches={0}
  promoText="Start earning today"
  expirationDate="06/30/26"
/>
```

### All Punches Earned

```tsx
<RewardsCard
  backgroundSrc="/images/rewards-card/rewards-card-bg.png"
  logoSrc="/images/rewards-card/logo.png"
  totalPunches={5}
  earnedPunches={5}
  promoText="You earned your reward!"
  expirationDate="12/31/26"
/>
```

### With Additional Class

```tsx
<RewardsCard
  backgroundSrc="/images/rewards-card/rewards-card-bg.png"
  logoSrc="/images/rewards-card/logo.png"
  totalPunches={5}
  earnedPunches={1}
  promoText="Keep going — 4 more to go"
  expirationDate="12/31/26"
  className="my-custom-modifier"
/>
```

## Image Assets

Static assets are served from `public/images/rewards-card/`. The punch tracker and rewards icon images are hardcoded internally; only the background and logo are configurable via props.

| File | Usage |
|------|-------|
| `rewards-card-bg.png` | Pass as `backgroundSrc` — full-bleed card background |
| `logo.png` | Pass as `logoSrc` — brand logo in top bar |
| `item-count-filled.svg` | Rendered automatically for each earned punch slot |
| `item-count-empty.svg` | Rendered automatically for each unearned punch slot |
| `item-count-checkmark.svg` | Overlaid on each filled punch slot |
| `rewards-icon-bottom.svg` | Bottom layer of the stacked rewards icon |
| `rewards-icon-top.svg` | Top layer of the stacked rewards icon |
| `icon-clock.svg` | Clock icon inside the expiration badge |

## Component Structure

```
.rewards-card                     ← wrapper; position: relative
├── .rewards-card__background     ← full-bleed <Image fill> (aria-hidden)
├── .rewards-card__top-bar        ← absolutely positioned row
│   ├── .rewards-card__logo       ← brand logo (48×30)
│   ├── .rewards-card__tracker    ← punch progress column
│   │   ├── .rewards-card__punch-group   ← row of punch circles
│   │   │   └── .rewards-card__punch     ← individual slot (×N)
│   │   │       └── .rewards-card__punch-checkmark  ← overlay when filled
│   │   └── .rewards-card__tracker-text  ← "X of Y Purchased"
│   └── .rewards-card__rewards-label     ← stacked icon + "Rewards" text
└── .rewards-card__content        ← absolutely positioned bottom section
    ├── .rewards-card__promo-text
    └── .rewards-card__expiry-badge
        ├── .rewards-card__expiry-icon
        └── .rewards-card__expiry-date
```

## Punch Tracker Behaviour

The component derives the punch state array internally:

```typescript
const punches = Array.from({ length: totalPunches }, (_, i) => i < earnedPunches);
```

Slots are filled left to right. Each slot renders:
- `item-count-filled.svg` or `item-count-empty.svg` as the base image
- `item-count-checkmark.svg` overlaid when the slot is filled
- `aria-label="Purchased"` or `aria-label="Not yet purchased"` on the slot wrapper
- A visible count line: `"{earnedPunches} of {totalPunches} Purchased"`

## Accessibility

### Interactive Mode (onClick provided)

| Attribute | Value | Condition |
|-----------|-------|-----------|
| `role` | `"button"` | `onClick` is defined |
| `tabIndex` | `0` | `onClick` is defined |
| `onKeyDown` | activates on `Enter` or `Space` | `onClick` is defined |

### Keyboard Navigation

- `Tab` — moves focus onto the card when it is interactive
- `Enter` / `Space` — triggers `onClick`
- No keyboard attributes are set when `onClick` is omitted

### Image Alt Text

| Image | Alt text | Rationale |
|-------|----------|-----------|
| Background | `""` + `aria-hidden="true"` | Decorative; described by surrounding content |
| Brand logo | `"Brand logo"` | Meaningful — identifies the brand |
| Punch base (filled/empty) | `""` + `aria-hidden="true"` | State communicated via parent `aria-label` |
| Punch checkmark | `""` + `aria-hidden="true"` | Decorative overlay |
| Rewards icon layers | `""` + `aria-hidden="true"` | Decorative; label provided by sibling text |
| Clock icon | `"Expires"` | Meaningful — conveys time/expiry context |

### Punch Indicator Labels

Each punch slot div carries an `aria-label`:

```tsx
aria-label={filled ? 'Purchased' : 'Not yet purchased'}
```

This lets screen readers enumerate the punch state without relying on the decorative images.

## Styling

The component uses CSS Modules with BEM naming (`RewardsCard.module.scss`). It imports `variables` and `mixins` from the shared styles folder:

```scss
@use '../../../styles/variables' as *;
@use '../../../styles/mixins' as *;
```

Key layout choices:
- The card wrapper is `position: relative` with `overflow: hidden` to contain the fill image and absolutely positioned sections
- The top bar is horizontally centred via `left: 50%; transform: translateX(-50%)` and fixed at `width: 295px`
- The bottom content section is anchored via `position: absolute; bottom: 16.67px; left: 23.67px`
- Typography uses `@include text-tracker`, `@include text-rewards-label`, `@include text-promo`, and `@include text-expiry` from the shared mixins
- No hardcoded colours — all colour values reference SCSS variables (`$color-white`, `$border-color`, etc.)

## Testing

Tests live in `RewardsCard.test.tsx` alongside the component. The suite uses React Testing Library and `@testing-library/user-event`.

### Test Coverage Areas

| Area | What is tested |
|------|---------------|
| Rendering | Required props render without errors; promo text and expiration date appear |
| Punch tracking | Correct total, filled, and empty counts; checkmark count; "X of Y Purchased" text |
| Images | `backgroundSrc` and `logoSrc` are applied; clock icon alt text is present |
| onClick interaction | Click, `Enter`, `Space` all call the handler; non-activating keys do not |
| Accessibility attributes | `role="button"` and `tabIndex` present only when `onClick` is provided; punch aria-labels |
| className prop | Custom class is appended alongside the base module class |

### Running Tests

```bash
npm run test -- --testPathPattern=RewardsCard
```

### Example Tests

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

const defaultProps = {
  backgroundSrc: '/images/bg.jpg',
  logoSrc: '/images/logo.png',
  totalPunches: 5,
  earnedPunches: 2,
  promoText: 'Buy 5 get 1 free',
  expirationDate: 'Exp 12/31/2025',
};

test('renders promo text', () => {
  render(<RewardsCard {...defaultProps} />);
  expect(screen.getByText('Buy 5 get 1 free')).toBeInTheDocument();
});

test('calls onClick when card is clicked', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<RewardsCard {...defaultProps} onClick={handleClick} />);
  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('marks correct punches as filled', () => {
  render(<RewardsCard {...defaultProps} totalPunches={5} earnedPunches={3} />);
  expect(screen.getAllByLabelText('Purchased')).toHaveLength(3);
  expect(screen.getAllByLabelText('Not yet purchased')).toHaveLength(2);
});
```

## Related Components

- `atoms/Image` — Next.js `<Image>` is used throughout for optimised asset delivery
- Any organism or template that composes a list of reward cards should pass a unique `key` and handle the `onClick` to navigate or open a detail view

## Changelog

### 1.0.0 (2026-04-01)

- Initial release
- Full-bleed background image with configurable `backgroundSrc` and `logoSrc`
- Punch tracker with filled/empty/checkmark states and `aria-label` per slot
- Interactive mode activated by `onClick` prop (`role="button"`, keyboard support)
- Expiration badge with clock icon
- SCSS Modules with BEM naming; no hardcoded colours or fonts
