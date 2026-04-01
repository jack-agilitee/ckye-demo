import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RewardsCard from './RewardsCard';

const defaultProps = {
  title: 'Buy 5 Get 1 Free',
  totalPunches: 5,
  purchasedPunches: 3,
  expirationDate: '12/31/26',
  backgroundImage: '/images/bg.jpg',
  logoSrc: '/images/logo.png',
};

const renderCard = (props = {}) =>
  render(<RewardsCard {...defaultProps} {...props} />);

describe('RewardsCard', () => {
  describe('Rendering', () => {
    it('renders without crashing with required props', () => {
      renderCard();
      expect(screen.getByText('Buy 5 Get 1 Free')).toBeInTheDocument();
    });

    it('renders with only the truly required props (no onClick, default totalPunches and purchasedPunches)', () => {
      render(
        <RewardsCard
          title="Free Coffee"
          expirationDate="01/01/27"
          backgroundImage="/bg.jpg"
          logoSrc="/logo.png"
        />
      );
      expect(screen.getByText('Free Coffee')).toBeInTheDocument();
    });
  });

  describe('Title display', () => {
    it('shows the promotional title text', () => {
      renderCard({ title: 'Earn Double Points Today' });
      expect(screen.getByText('Earn Double Points Today')).toBeInTheDocument();
    });
  });

  describe('Punch tracker', () => {
    it('renders correct number of filled punch images', () => {
      renderCard({ purchasedPunches: 3, totalPunches: 5 });
      const filledPunches = screen.getAllByAltText('Punch filled');
      expect(filledPunches).toHaveLength(3);
    });

    it('renders correct number of empty punch images', () => {
      renderCard({ purchasedPunches: 3, totalPunches: 5 });
      const emptyPunches = screen.getAllByAltText('Punch empty');
      expect(emptyPunches).toHaveLength(2);
    });

    it('renders all empty punches when purchasedPunches is 0', () => {
      renderCard({ purchasedPunches: 0, totalPunches: 5 });
      expect(screen.queryByAltText('Punch filled')).not.toBeInTheDocument();
      expect(screen.getAllByAltText('Punch empty')).toHaveLength(5);
    });

    it('renders all filled punches when purchasedPunches equals totalPunches', () => {
      renderCard({ purchasedPunches: 5, totalPunches: 5 });
      expect(screen.getAllByAltText('Punch filled')).toHaveLength(5);
      expect(screen.queryByAltText('Punch empty')).not.toBeInTheDocument();
    });

    it('clamps purchasedPunches to totalPunches when over-supplied', () => {
      renderCard({ purchasedPunches: 10, totalPunches: 5 });
      expect(screen.getAllByAltText('Punch filled')).toHaveLength(5);
      expect(screen.queryByAltText('Punch empty')).not.toBeInTheDocument();
    });

    it('has an aria-label on the punch group reflecting counts', () => {
      renderCard({ purchasedPunches: 2, totalPunches: 4 });
      expect(screen.getByLabelText('2 of 4 punches')).toBeInTheDocument();
    });
  });

  describe('Progress text', () => {
    it('shows "{purchasedPunches} of {totalPunches} Purchased"', () => {
      renderCard({ purchasedPunches: 3, totalPunches: 5 });
      expect(screen.getByText('3 of 5 Purchased')).toBeInTheDocument();
    });

    it('shows "0 of 5 Purchased" when purchasedPunches is 0', () => {
      renderCard({ purchasedPunches: 0, totalPunches: 5 });
      expect(screen.getByText('0 of 5 Purchased')).toBeInTheDocument();
    });

    it('shows clamped value in progress text when purchasedPunches exceeds totalPunches', () => {
      renderCard({ purchasedPunches: 10, totalPunches: 5 });
      expect(screen.getByText('5 of 5 Purchased')).toBeInTheDocument();
    });
  });

  describe('Expiration date', () => {
    it('displays the expiration date', () => {
      renderCard({ expirationDate: '12/31/26' });
      expect(screen.getByText('12/31/26')).toBeInTheDocument();
    });

    it('displays a different expiration date', () => {
      renderCard({ expirationDate: '06/30/27' });
      expect(screen.getByText('06/30/27')).toBeInTheDocument();
    });
  });

  describe('Background image', () => {
    it('renders the background image with the correct src', () => {
      const { container } = renderCard({ backgroundImage: '/images/promo-bg.jpg' });
      const bgImage = container.querySelector('img[src="/images/promo-bg.jpg"]');
      expect(bgImage).toBeInTheDocument();
    });

    it('renders the background image with an empty alt (decorative)', () => {
      const { container } = renderCard({ backgroundImage: '/images/promo-bg.jpg' });
      const bgImage = container.querySelector('img[src="/images/promo-bg.jpg"]');
      expect(bgImage).toHaveAttribute('alt', '');
    });
  });

  describe('Logo', () => {
    it('renders the brand logo image', () => {
      renderCard({ logoSrc: '/images/brand-logo.png' });
      expect(screen.getByAltText('Brand logo')).toBeInTheDocument();
    });

    it('renders the logo with the correct src', () => {
      renderCard({ logoSrc: '/images/brand-logo.png' });
      expect(screen.getByAltText('Brand logo')).toHaveAttribute(
        'src',
        '/images/brand-logo.png'
      );
    });
  });

  describe('"Rewards" text', () => {
    it('shows the "Rewards" label', () => {
      renderCard();
      expect(screen.getByText('Rewards')).toBeInTheDocument();
    });
  });

  describe('Click handler', () => {
    it('calls onClick when the card is clicked', () => {
      const onClick = jest.fn();
      renderCard({ onClick });
      fireEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('gives the card role="button" when onClick is provided', () => {
      renderCard({ onClick: jest.fn() });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('applies aria-label with title when onClick is provided', () => {
      renderCard({ onClick: jest.fn(), title: 'Buy 5 Get 1 Free' });
      expect(
        screen.getByLabelText('Rewards card: Buy 5 Get 1 Free')
      ).toBeInTheDocument();
    });

    it('does not apply aria-label when onClick is not provided', () => {
      const { container } = renderCard({ onClick: undefined });
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveAttribute('aria-label');
    });

    it('calls onClick when Enter key is pressed', () => {
      const onClick = jest.fn();
      renderCard({ onClick });
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Space key is pressed', () => {
      const onClick = jest.fn();
      renderCard({ onClick });
      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('No onClick prop', () => {
    it('renders without errors when onClick is not provided', () => {
      expect(() => renderCard({ onClick: undefined })).not.toThrow();
    });

    it('does not have role="button" when onClick is omitted', () => {
      renderCard({ onClick: undefined });
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('Default props', () => {
    it('works with default totalPunches (5) when not explicitly provided', () => {
      render(
        <RewardsCard
          title="Default test"
          expirationDate="01/01/27"
          backgroundImage="/bg.jpg"
          logoSrc="/logo.png"
        />
      );
      expect(screen.getByText('0 of 5 Purchased')).toBeInTheDocument();
      expect(screen.getAllByAltText('Punch empty')).toHaveLength(5);
    });
  });
});
