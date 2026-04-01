# RewardsCard

## Overview

`RewardsCard` is a molecule-level component that displays a branded promotional punch card. It shows the user's progress toward a reward — rendered as a row of filled and empty punch icons — alongside the promotional offer title, expiration date, brand logo, and a "Rewards" label. The card supports an optional click handler, which converts it into a fully accessible interactive button.

## Figma Reference

- **Design URL**: [RewardsCard in Figma](https://www.figma.com/design/QdNa0mQSKgQHvX7ZgQM6NR/%F0%9F%95%B3%EF%B8%8F-Rewards-Phase-2?node-id=16458-15805&m=dev)
- **Last Updated**: 2026-04-01

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
      title="Buy 5 Cheetos products to earn 1 for 1¢"
      totalPunches={5}
      purchasedPunches={2}
      expirationDate="12/31/26"
      backgroundImage="/rewards-card/background.png"
      logoSrc="/rewards-card/logo.png"
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | `string` | — | Yes | Promotional offer text displayed at the bottom of the card (e.g., "Buy 5 Cheetos products to earn 1 for 1¢") |
| `expirationDate` | `string` | — | Yes | Expiration date string rendered next to the clock icon (e.g., `"12/31/26"`) |
| `backgroundImage` | `string` | — | Yes | Path to the card background image, passed directly to Next.js `Image` |
| `logoSrc` | `string` | — | Yes | Path to the brand logo image, passed directly to Next.js `Image` |
| `totalPunches` | `number` | `5` | No | Total number of punch slots rendered in the tracker |
| `purchasedPunches` | `number` | `0` | No | Number of filled punch slots. Values exceeding `totalPunches` are clamped |
| `onClick` | `() => void` | — | No | When provided, the card receives `role="button"`, `tabIndex={0}`, and keyboard event support |

## Examples

### Default (non-interactive)

```tsx
<RewardsCard
  title="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  purchasedPunches={2}
  expirationDate="12/31/26"
  backgroundImage="/rewards-card/background.png"
  logoSrc="/rewards-card/logo.png"
/>
```

### With click handler (interactive)

```tsx
<RewardsCard
  title="Buy 5 Cheetos products to earn 1 for 1¢"
  purchasedPunches={3}
  expirationDate="12/31/26"
  backgroundImage="/rewards-card/background.png"
  logoSrc="/rewards-card/logo.png"
  onClick={() => router.push('/rewards/123')}
/>
```

### All punches completed

```tsx
<RewardsCard
  title="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  purchasedPunches={5}
  expirationDate="12/31/26"
  backgroundImage="/rewards-card/background.png"
  logoSrc="/rewards-card/logo.png"
/>
```

### Zero punches (fresh card)

```tsx
<RewardsCard
  title="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  purchasedPunches={0}
  expirationDate="12/31/26"
  backgroundImage="/rewards-card/background.png"
  logoSrc="/rewards-card/logo.png"
/>
```

## Component Structure

The card is divided into two horizontal zones:

**Top bar** (`rewards-card__top`): brand logo (left), punch tracker with progress text (center), "Rewards" label with gift icon (right).

**Bottom section** (`rewards-card__bottom`): promotional title text (left), expiration badge with clock icon (right).

A full-bleed background image sits behind both zones at `z-index: 0`; the content layers sit at `z-index: 1`.

## Punch Tracker Behavior

- `totalPunches` controls how many icons are rendered.
- `purchasedPunches` controls how many of those icons use the filled variant.
- If `purchasedPunches` exceeds `totalPunches` the value is clamped internally via `Math.min`. The component never renders more filled icons than the total slot count.
- Progress text below the icons reads `"{purchasedPunches} of {totalPunches} Purchased"` and reflects the clamped value.

## Accessibility

### Non-interactive card (no `onClick`)

- The outer `div` has no interactive role or `tabIndex`.
- The background image has `alt=""` (decorative).
- The punch group `div` carries `aria-label="{n} of {total} punches"` to communicate progress to screen readers.
- The rewards icon and clock icon carry `aria-hidden="true"` (decorative).

### Interactive card (`onClick` provided)

- The outer `div` receives `role="button"` and `tabIndex={0}`.
- `aria-label="Rewards card: {title}"` is applied to the card element.
- Keyboard support: `Enter` and `Space` both trigger `onClick` and call `preventDefault` to prevent page scroll on Space.
- Focus-visible styling is applied via the CSS `[role='button']:focus-visible` selector (white outline).

### ARIA summary

| Element | Attribute | Value |
|---------|-----------|-------|
| Card (interactive) | `role` | `"button"` |
| Card (interactive) | `tabIndex` | `0` |
| Card | `aria-label` | `"Rewards card: {title}"` |
| Punch group | `aria-label` | `"{n} of {total} punches"` |
| Background image | `alt` | `""` (decorative) |
| Rewards icon | `aria-hidden` | `"true"` |
| Clock icon | `aria-hidden` | `"true"` |

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| `Tab` | Focuses the card when `onClick` is provided |
| `Enter` | Fires `onClick` |
| `Space` | Fires `onClick`, prevents default scroll |

## Assets Required

Place the following files in `public/rewards-card/`:

| File | Description |
|------|-------------|
| `background.png` | Card background image |
| `logo.png` | Brand logo (displayed top-left) |
| `punch-filled.svg` | Filled punch circle with checkmark |
| `punch-empty.svg` | Empty punch circle |
| `rewards-icon.svg` | Gift/rewards icon (top-right label) |
| `clock-icon.svg` | Clock/timer icon (expiration badge) |

Punch icons are sourced from fixed public paths (`/rewards-card/punch-filled.svg`, `/rewards-card/punch-empty.svg`). Background image and logo accept arbitrary paths via props.

## Design Tokens

The component consumes the following tokens from the shared SCSS variables and mixins:

| Token | Usage |
|-------|-------|
| `$radius-md` | Card border radius (14px) |
| `$radius-sm` | Expiration badge border radius (3px) |
| `$border-color` | Card border (`#d4d4d4`) |
| `$shadow-card` | Outer box shadow on the card |
| `$shadow-text` | Text shadow applied to white labels |
| `$white` | Text and outline color |
| `$focus-ring-width` | Keyboard focus outline width |
| `$focus-ring-offset` | Keyboard focus outline offset |
| `$font-size-xs` | Expiration date font size (8px) |
| `@include label` | Progress text and expiration date typography |
| `@include button-text` | "Rewards" label typography |
| `@include heading-3` | Promotional title typography |

Typography uses Montserrat at SemiBold (600) and Bold (700) weights depending on the mixin applied.

## Responsive Behavior

The card maintains a fixed aspect ratio of `295:180` at all viewport sizes via `aspect-ratio: 295 / 180`. Width is `100%` of its container, so the card scales proportionally when placed inside constrained layouts.

The background image uses `sizes="(max-width: 768px) 100vw, 295px"` for Next.js image optimization.

## Testing

The component ships with 27 tests in `RewardsCard.test.tsx`. Coverage spans:

- Rendering with all required props and with only the minimum required props
- Title display
- Punch tracker: filled count, empty count, zero state, completed state, over-supply clamping, `aria-label` value
- Progress text: standard, zero, and clamped display
- Expiration date display
- Background image: `src` attribute and empty `alt`
- Logo: `alt` text and `src` attribute
- "Rewards" label presence
- Click handler: call on click, `role="button"` assignment, `aria-label` content, Enter key, Space key
- No `onClick`: no error thrown, no `role="button"` present
- Default props: `totalPunches` defaults to 5

### Test ID

The component does not set a `data-testid` by default. Query it in tests using `role` (when interactive) or text content:

```tsx
// Interactive card
screen.getByRole('button');

// Non-interactive card — query by title text
screen.getByText('Buy 5 Cheetos products to earn 1 for 1¢');

// Punch group progress
screen.getByLabelText('2 of 5 punches');
```

### Testing Examples

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

const baseProps = {
  title: 'Buy 5 Get 1 Free',
  expirationDate: '12/31/26',
  backgroundImage: '/images/bg.jpg',
  logoSrc: '/images/logo.png',
};

test('renders promotional title', () => {
  render(<RewardsCard {...baseProps} />);
  expect(screen.getByText('Buy 5 Get 1 Free')).toBeInTheDocument();
});

test('shows correct punch progress', () => {
  render(<RewardsCard {...baseProps} totalPunches={5} purchasedPunches={3} />);
  expect(screen.getByText('3 of 5 Purchased')).toBeInTheDocument();
  expect(screen.getAllByAltText('Punch filled')).toHaveLength(3);
  expect(screen.getAllByAltText('Punch empty')).toHaveLength(2);
});

test('fires onClick when card is activated', () => {
  const onClick = jest.fn();
  render(<RewardsCard {...baseProps} onClick={onClick} />);
  fireEvent.click(screen.getByRole('button'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

## TypeScript Interface

```typescript
export interface RewardsCardProps {
  /**
   * Promotional offer text displayed at the bottom of the card.
   * @example "Buy 5 Cheetos products to earn 1 for 1¢"
   */
  title: string;

  /**
   * Total number of punch slots to render in the tracker.
   * @default 5
   */
  totalPunches?: number;

  /**
   * Number of punch slots shown as filled.
   * Clamped to `totalPunches` if it exceeds that value.
   * @default 0
   */
  purchasedPunches?: number;

  /**
   * Expiration date string rendered in the bottom-right badge.
   * @example "12/31/26"
   */
  expirationDate: string;

  /**
   * Path to the card background image.
   */
  backgroundImage: string;

  /**
   * Path to the brand logo image displayed in the top-left.
   */
  logoSrc: string;

  /**
   * Optional click handler. When provided the card becomes an interactive
   * button with `role="button"`, `tabIndex={0}`, and keyboard support.
   */
  onClick?: () => void;
}
```

## Related Components

- `components/atoms/` — basic atoms consumed indirectly through Next.js `Image`
- Any list or grid component that renders multiple `RewardsCard` instances side-by-side

## Changelog

### Version 1.0.0 (2026-04-01)

- Initial release
- Punch tracker with clamping logic
- Optional interactive button mode with keyboard and ARIA support
- Background image, brand logo, expiration badge
- 27-test suite
