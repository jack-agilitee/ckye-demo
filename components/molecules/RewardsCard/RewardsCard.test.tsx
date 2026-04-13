import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RewardsCard from './RewardsCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; sizes?: string }) => {
    const { fill: _fill, priority: _priority, sizes: _sizes, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

const activatedDefaults = {
  variant: 'activated' as const,
  brandLogoSrc: '/logo.png',
  backgroundImageSrc: '/bg.jpg',
  description: 'Buy 5, get 1 free',
  expirationDate: 'Expires Dec 31',
  purchasedCount: 3,
  requiredCount: 5,
};

const exploreDefaults = {
  variant: 'explore' as const,
  brandLogoSrc: '/logo.png',
  backgroundImageSrc: '/bg.jpg',
  description: 'Earn double points',
  expirationDate: 'Expires Jan 15',
};

describe('RewardsCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Common rendering', () => {
    it('renders without crashing', () => {
      render(<RewardsCard {...activatedDefaults} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('renders brand logo with correct src', () => {
      render(<RewardsCard {...activatedDefaults} brandLogoSrc="/my-brand-logo.png" />);
      const logo = screen.getByAltText('Brand logo');
      expect(logo).toHaveAttribute('src', '/my-brand-logo.png');
    });

    it('renders background image', () => {
      const { container } = render(<RewardsCard {...activatedDefaults} backgroundImageSrc="/hero.jpg" />);
      // Background uses next/image with fill and empty alt — query directly from DOM
      const allImgs = container.querySelectorAll('img');
      const bg = Array.from(allImgs).find((img) => img.getAttribute('src') === '/hero.jpg');
      expect(bg).toBeTruthy();
    });

    it('renders description text', () => {
      render(<RewardsCard {...activatedDefaults} description="Buy 5, get 1 free" />);
      expect(screen.getByText('Buy 5, get 1 free')).toBeInTheDocument();
    });

    it('renders expiration date', () => {
      render(<RewardsCard {...activatedDefaults} expirationDate="Expires Dec 31" />);
      expect(screen.getByText('Expires Dec 31')).toBeInTheDocument();
    });

    it('renders Rewards badge text', () => {
      render(<RewardsCard {...activatedDefaults} />);
      expect(screen.getByText('Rewards')).toBeInTheDocument();
    });
  });

  describe('activated variant', () => {
    it('renders progress tracker when requiredCount > 0', () => {
      render(<RewardsCard {...activatedDefaults} purchasedCount={2} requiredCount={4} />);
      expect(screen.getByText('2 of 4 Purchased')).toBeInTheDocument();
    });

    it('does not render activate button', () => {
      render(<RewardsCard {...activatedDefaults} />);
      expect(screen.queryByRole('button', { name: /activate/i })).not.toBeInTheDocument();
    });

    it('shows correct number of filled punch circles', () => {
      render(<RewardsCard {...activatedDefaults} purchasedCount={3} requiredCount={5} />);
      const filledCircles = screen.getAllByAltText('Purchased');
      expect(filledCircles).toHaveLength(3);
    });

    it('shows correct number of empty punch circles', () => {
      render(<RewardsCard {...activatedDefaults} purchasedCount={3} requiredCount={5} />);
      const emptyCircles = screen.getAllByAltText('Remaining');
      expect(emptyCircles).toHaveLength(2);
    });

    it('shows "X of Y Purchased" label with correct counts', () => {
      render(<RewardsCard {...activatedDefaults} purchasedCount={1} requiredCount={6} />);
      expect(screen.getByText('1 of 6 Purchased')).toBeInTheDocument();
    });

    it('shows banked rewards indicator when bankedRewards > 0', () => {
      render(<RewardsCard {...activatedDefaults} bankedRewards={2} />);
      expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('hides banked rewards indicator when bankedRewards is 0', () => {
      render(<RewardsCard {...activatedDefaults} bankedRewards={0} />);
      expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
    });

    it('hides banked rewards indicator when bankedRewards is undefined', () => {
      render(<RewardsCard {...activatedDefaults} bankedRewards={undefined} />);
      expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument();
    });

    it('does not render tracker when requiredCount is 0', () => {
      render(<RewardsCard {...activatedDefaults} requiredCount={0} purchasedCount={0} />);
      expect(screen.queryByText(/of.*Purchased/)).not.toBeInTheDocument();
    });
  });

  describe('explore variant', () => {
    it('shows Activate button', () => {
      render(<RewardsCard {...exploreDefaults} />);
      expect(screen.getByRole('button', { name: /activate reward/i })).toBeInTheDocument();
    });

    it('shows Activate button with correct label text', () => {
      render(<RewardsCard {...exploreDefaults} />);
      expect(screen.getByText('Activate')).toBeInTheDocument();
    });

    it('calls onActivate when Activate button is clicked', async () => {
      const user = userEvent.setup();
      const onActivate = jest.fn();
      render(<RewardsCard {...exploreDefaults} onActivate={onActivate} />);
      await user.click(screen.getByRole('button', { name: /activate reward/i }));
      expect(onActivate).toHaveBeenCalledTimes(1);
    });

    it('does not render punch tracker', () => {
      render(<RewardsCard {...exploreDefaults} />);
      expect(screen.queryByText(/of.*Purchased/)).not.toBeInTheDocument();
      expect(screen.queryByAltText('Purchased')).not.toBeInTheDocument();
      expect(screen.queryByAltText('Remaining')).not.toBeInTheDocument();
    });

    it('does not crash when onActivate is undefined', () => {
      render(<RewardsCard {...exploreDefaults} onActivate={undefined} />);
      const button = screen.getByRole('button', { name: /activate reward/i });
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('clicking Activate does not bubble to card onClick', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const onActivate = jest.fn();
      render(<RewardsCard {...exploreDefaults} onClick={onClick} onActivate={onActivate} />);
      await user.click(screen.getByRole('button', { name: /activate reward/i }));
      expect(onActivate).toHaveBeenCalledTimes(1);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('Interaction', () => {
    it('calls onClick when card is clicked', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<RewardsCard {...activatedDefaults} onClick={onClick} />);
      await user.click(screen.getByRole('article'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not crash when onClick is undefined', () => {
      render(<RewardsCard {...activatedDefaults} onClick={undefined} />);
      expect(() => fireEvent.click(screen.getByRole('article'))).not.toThrow();
    });

    it('card is not focusable when onClick is not provided', () => {
      render(<RewardsCard {...activatedDefaults} onClick={undefined} />);
      expect(screen.getByRole('article')).not.toHaveAttribute('tabindex');
    });

    it('card is focusable when onClick is provided', () => {
      render(<RewardsCard {...activatedDefaults} onClick={jest.fn()} />);
      expect(screen.getByRole('article')).toHaveAttribute('tabindex', '0');
    });

    it('calls onClick when Enter key is pressed on card', () => {
      const onClick = jest.fn();
      render(<RewardsCard {...activatedDefaults} onClick={onClick} />);
      fireEvent.keyDown(screen.getByRole('article'), { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed on card', () => {
      const onClick = jest.fn();
      render(<RewardsCard {...activatedDefaults} onClick={onClick} />);
      fireEvent.keyDown(screen.getByRole('article'), { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('card has role="article"', () => {
      render(<RewardsCard {...activatedDefaults} />);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('Activate button has accessible aria-label', () => {
      render(<RewardsCard {...exploreDefaults} />);
      const btn = screen.getByRole('button', { name: 'Activate reward' });
      expect(btn).toBeInTheDocument();
    });

    it('Activate button is keyboard accessible via tab', async () => {
      const user = userEvent.setup();
      render(<RewardsCard {...exploreDefaults} />);
      await user.tab();
      expect(screen.getByRole('button', { name: /activate reward/i })).toHaveFocus();
    });

    it('brand logo has descriptive alt text', () => {
      render(<RewardsCard {...activatedDefaults} />);
      expect(screen.getByAltText('Brand logo')).toBeInTheDocument();
    });
  });
});
