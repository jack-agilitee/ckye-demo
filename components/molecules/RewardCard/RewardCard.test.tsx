import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardCard from './RewardCard';

const baseProps = {
  backgroundImage: '/images/bg.jpg',
  brandLogo: '/images/logo.png',
  description: 'Buy 5 get 1 free',
  expiresAt: 'Dec 31, 2025',
};

const activatedProps = {
  ...baseProps,
  variant: 'activated' as const,
  purchasedCount: 3,
  totalRequired: 5,
  bankedRewards: 2,
};

const exploreProps = {
  ...baseProps,
  variant: 'explore' as const,
  onActivate: jest.fn(),
};

describe('RewardCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering — shared elements', () => {
    it('renders the background image with correct src', () => {
      render(<RewardCard {...activatedProps} />);
      const allImgs = document.querySelectorAll('img');
      const bgImg = Array.from(allImgs).find(
        (img) => img.getAttribute('src') === '/images/bg.jpg'
      ) as HTMLImageElement;
      expect(bgImg).toBeTruthy();
      expect(bgImg.getAttribute('src')).toBe('/images/bg.jpg');
    });

    it('renders the brand logo with correct src and alt text', () => {
      render(<RewardCard {...activatedProps} />);
      const logo = screen.getByAltText('Brand logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/logo.png');
    });

    it('renders the description text', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.getByText('Buy 5 get 1 free')).toBeInTheDocument();
    });

    it('renders the "Rewards" badge label', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.getByText('Rewards')).toBeInTheDocument();
    });
  });

  describe('Activated variant', () => {
    it('renders without crashing', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('renders the correct total number of punch circles', () => {
      render(<RewardCard {...activatedProps} />);
      const purchased = screen.getAllByAltText('Purchased');
      const remaining = screen.getAllByAltText('Remaining');
      expect(purchased).toHaveLength(3);
      expect(remaining).toHaveLength(2);
      expect(purchased.length + remaining.length).toBe(5);
    });

    it('renders the correct number of filled (checked) circles', () => {
      render(<RewardCard {...activatedProps} />);
      const filled = screen.getAllByAltText('Purchased');
      expect(filled).toHaveLength(3);
      filled.forEach((img) => {
        expect(img).toHaveAttribute('src', '/reward-card/punch-circle-checked.svg');
      });
    });

    it('renders the correct number of empty circles', () => {
      render(<RewardCard {...activatedProps} />);
      const empty = screen.getAllByAltText('Remaining');
      expect(empty).toHaveLength(2);
      empty.forEach((img) => {
        expect(img).toHaveAttribute('src', '/reward-card/punch-circle-empty.svg');
      });
    });

    it('renders the "X of Y Purchased" tracker label', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.getByText('3 of 5 Purchased')).toBeInTheDocument();
    });

    it('renders the expiration date', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.getByText('Dec 31, 2025')).toBeInTheDocument();
    });

    it('does NOT render an Activate button', () => {
      render(<RewardCard {...activatedProps} />);
      expect(screen.queryByRole('button', { name: /activate/i })).not.toBeInTheDocument();
    });

    it('shows the banked rewards badge when bankedRewards > 0', () => {
      render(<RewardCard {...activatedProps} bankedRewards={4} />);
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('does NOT show the banked rewards badge when bankedRewards is 0', () => {
      render(
        <RewardCard
          {...activatedProps}
          bankedRewards={0}
          purchasedCount={3}
          totalRequired={5}
        />
      );
      // With purchasedCount=3 and totalRequired=5, the tracker shows "3 of 5 Purchased"
      // "0" would only appear as the banked badge value — ensure it's absent
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('does NOT show the banked rewards badge when bankedRewards is undefined', () => {
      render(
        <RewardCard
          {...baseProps}
          variant="activated"
          purchasedCount={3}
          totalRequired={5}
        />
      );
      // bankedRewards defaults to 0, so badge should not render
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('Explore variant', () => {
    it('renders without crashing', () => {
      render(<RewardCard {...exploreProps} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('renders the Activate button', () => {
      render(<RewardCard {...exploreProps} />);
      expect(screen.getByRole('button', { name: /activate/i })).toBeInTheDocument();
    });

    it('button has the correct aria-label referencing description', () => {
      render(<RewardCard {...exploreProps} />);
      expect(
        screen.getByRole('button', { name: 'Activate reward: Buy 5 get 1 free' })
      ).toBeInTheDocument();
    });

    it('calls onActivate when the Activate button is clicked', () => {
      const onActivate = jest.fn();
      render(<RewardCard {...exploreProps} onActivate={onActivate} />);
      fireEvent.click(screen.getByRole('button', { name: /activate/i }));
      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it('does NOT render the punch tracker', () => {
      render(<RewardCard {...exploreProps} />);
      expect(screen.queryByAltText('Purchased')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Remaining')).not.toBeInTheDocument();
      expect(screen.queryByText(/Purchased$/)).not.toBeInTheDocument();
    });

    it('does NOT render the expiration date', () => {
      render(<RewardCard {...exploreProps} />);
      expect(screen.queryByText('Dec 31, 2025')).not.toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles purchasedCount of 0 — all circles are empty', () => {
      render(
        <RewardCard
          {...baseProps}
          variant="activated"
          purchasedCount={0}
          totalRequired={5}
        />
      );
      expect(screen.queryByAltText('Purchased')).not.toBeInTheDocument();
      expect(screen.getAllByAltText('Remaining')).toHaveLength(5);
      expect(screen.getByText('0 of 5 Purchased')).toBeInTheDocument();
    });

    it('handles all circles filled (purchasedCount === totalRequired)', () => {
      render(
        <RewardCard
          {...baseProps}
          variant="activated"
          purchasedCount={5}
          totalRequired={5}
        />
      );
      expect(screen.getAllByAltText('Purchased')).toHaveLength(5);
      expect(screen.queryByAltText('Remaining')).not.toBeInTheDocument();
      expect(screen.getByText('5 of 5 Purchased')).toBeInTheDocument();
    });

    it('uses default totalRequired of 5 when not provided', () => {
      render(
        <RewardCard
          {...baseProps}
          variant="activated"
          purchasedCount={2}
        />
      );
      const purchased = screen.getAllByAltText('Purchased');
      const remaining = screen.getAllByAltText('Remaining');
      expect(purchased.length + remaining.length).toBe(5);
    });
  });
});
