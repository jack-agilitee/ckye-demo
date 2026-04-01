import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RewardsCard from './RewardsCard';

const defaultProps = {
  backgroundImageUrl: '/images/bg.jpg',
  brandLogoUrl: '/images/logo.png',
  rewardDescription: 'Buy 5, get 1 free',
  totalPunches: 5,
  completedPunches: 2,
  expirationDate: '12/31/26',
};

describe('RewardsCard', () => {
  describe('Rendering', () => {
    it('renders without crashing and shows required content', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.getByText('Buy 5, get 1 free')).toBeInTheDocument();
      expect(screen.getByText('12/31/26')).toBeInTheDocument();
    });

    it('displays brand logo with alt text', () => {
      render(<RewardsCard {...defaultProps} />);
      const logo = screen.getByAltText('Brand logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/logo.png');
    });

    it('displays background image as aria-hidden', () => {
      const { container } = render(<RewardsCard {...defaultProps} />);
      // Background image has aria-hidden="true" and src set to backgroundImageUrl
      const ariaHiddenImgs = container.querySelectorAll('img[aria-hidden="true"]');
      const bgImage = Array.from(ariaHiddenImgs).find(
        (img) => img.getAttribute('src') === '/images/bg.jpg'
      );
      expect(bgImage).toBeTruthy();
    });

    it('renders correct number of punch circles', () => {
      render(<RewardsCard {...defaultProps} totalPunches={5} />);
      const listitems = screen.getAllByRole('listitem');
      expect(listitems).toHaveLength(5);
    });

    it('marks completed punches as Purchased and remaining as Not yet purchased', () => {
      render(<RewardsCard {...defaultProps} totalPunches={5} completedPunches={2} />);
      const purchased = screen.getAllByLabelText('Purchased');
      const notYet = screen.getAllByLabelText('Not yet purchased');
      expect(purchased).toHaveLength(2);
      expect(notYet).toHaveLength(3);
    });

    it('renders filled SVG src for completed punches and empty SVG for remaining', () => {
      render(<RewardsCard {...defaultProps} totalPunches={5} completedPunches={2} />);
      const listitems = screen.getAllByRole('listitem');

      // First 2 should contain the filled SVG
      const filledImg1 = listitems[0].querySelector('img');
      const filledImg2 = listitems[1].querySelector('img');
      expect(filledImg1).toHaveAttribute('src', '/rewards-card/punch-circle-filled.svg');
      expect(filledImg2).toHaveAttribute('src', '/rewards-card/punch-circle-filled.svg');

      // Last 3 should contain the empty SVG
      const emptyImg = listitems[2].querySelector('img');
      expect(emptyImg).toHaveAttribute('src', '/rewards-card/punch-circle-empty.svg');
    });

    it('displays tracker label with correct counts', () => {
      render(<RewardsCard {...defaultProps} totalPunches={5} completedPunches={2} />);
      expect(screen.getByText('2 of 5 Purchased')).toBeInTheDocument();
    });

    it('displays Rewards badge text', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.getByText('Rewards')).toBeInTheDocument();
    });

    it('displays expiration date in the pill', () => {
      render(<RewardsCard {...defaultProps} expirationDate="12/31/26" />);
      expect(screen.getByText('12/31/26')).toBeInTheDocument();
    });
  });

  describe('Banked Rewards', () => {
    it('shows banked rewards badge when bankedRewards > 0', () => {
      render(<RewardsCard {...defaultProps} bankedRewards={2} />);
      expect(screen.getByText('2 rewards banked')).toBeInTheDocument();
    });

    it('uses singular "reward" when bankedRewards is 1', () => {
      render(<RewardsCard {...defaultProps} bankedRewards={1} />);
      expect(screen.getByText('1 reward banked')).toBeInTheDocument();
    });

    it('hides banked rewards badge when bankedRewards is 0', () => {
      render(<RewardsCard {...defaultProps} bankedRewards={0} />);
      expect(screen.queryByText(/banked/)).not.toBeInTheDocument();
    });

    it('hides banked rewards badge when bankedRewards is undefined', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.queryByText(/banked/)).not.toBeInTheDocument();
    });
  });

  describe('ARIA and Accessibility', () => {
    it('has role="button" and tabIndex={0} when onClick is provided', () => {
      render(<RewardsCard {...defaultProps} onClick={jest.fn()} />);
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('does not have role="button" when onClick is not provided', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('has aria-label set to rewardDescription', () => {
      render(<RewardsCard {...defaultProps} onClick={jest.fn()} />);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'Buy 5, get 1 free');
    });

    it('has aria-label on expiration wrapper', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.getByLabelText('Expires 12/31/26')).toBeInTheDocument();
    });

    it('punch group list has aria-label', () => {
      render(<RewardsCard {...defaultProps} />);
      expect(screen.getByRole('list', { name: 'Punch progress' })).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when the card is clicked', () => {
      const onClick = jest.fn();
      render(<RewardsCard {...defaultProps} onClick={onClick} />);
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter is pressed on the card', () => {
      const onClick = jest.fn();
      render(<RewardsCard {...defaultProps} onClick={onClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space is pressed on the card', () => {
      const onClick = jest.fn();
      render(<RewardsCard {...defaultProps} onClick={onClick} />);
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw when card is clicked without onClick', () => {
      render(<RewardsCard {...defaultProps} />);
      // article element without role="button"
      const article = screen.getByLabelText('Buy 5, get 1 free');
      expect(() => fireEvent.click(article)).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('handles completedPunches=0 — all circles are empty', () => {
      render(<RewardsCard {...defaultProps} totalPunches={4} completedPunches={0} />);
      expect(screen.queryByLabelText('Purchased')).not.toBeInTheDocument();
      expect(screen.getAllByLabelText('Not yet purchased')).toHaveLength(4);
      expect(screen.getByText('0 of 4 Purchased')).toBeInTheDocument();
    });

    it('handles completedPunches equal to totalPunches — all circles filled', () => {
      render(<RewardsCard {...defaultProps} totalPunches={3} completedPunches={3} />);
      expect(screen.getAllByLabelText('Purchased')).toHaveLength(3);
      expect(screen.queryByLabelText('Not yet purchased')).not.toBeInTheDocument();
      expect(screen.getByText('3 of 3 Purchased')).toBeInTheDocument();
    });

    it('renders a single punch circle when totalPunches=1', () => {
      render(<RewardsCard {...defaultProps} totalPunches={1} completedPunches={0} />);
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });
  });
});
