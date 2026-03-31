import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RewardCard from './RewardCard';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...rest} />
  ),
}));

const defaultProps = {
  brandLogo: '/logos/kelloggs.png',
  backgroundImage: '/backgrounds/kelloggs-bg.png',
  brandName: "Kellogg's",
  title: "Buy 5 Kellogg's products to earn $3 OFF",
  expiryDate: '12/31/26',
};

describe('RewardCard', () => {
  it('renders the offer title', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText("Buy 5 Kellogg's products to earn $3 OFF")).toBeInTheDocument();
  });

  it('renders the expiry date', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('12/31/26')).toBeInTheDocument();
  });

  it('renders the Activate button', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: /activate kellogg's reward/i })).toBeInTheDocument();
  });

  it('renders the Rewards badge label', () => {
    render(<RewardCard {...defaultProps} />);
    expect(screen.getByText('Rewards')).toBeInTheDocument();
  });

  it('renders the brand logo with correct alt text', () => {
    render(<RewardCard {...defaultProps} />);
    const logo = screen.getByAltText("Kellogg's");
    expect(logo).toBeInTheDocument();
  });

  it('renders the background image', () => {
    render(<RewardCard {...defaultProps} />);
    const bgImage = screen.getByAltText('');
    expect(bgImage).toBeInTheDocument();
  });

  it('calls onActivate when the Activate button is clicked', () => {
    const onActivate = jest.fn();
    render(<RewardCard {...defaultProps} onActivate={onActivate} />);
    fireEvent.click(screen.getByRole('button', { name: /activate kellogg's reward/i }));
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it('does not throw when onActivate is not provided', () => {
    render(<RewardCard {...defaultProps} />);
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: /activate kellogg's reward/i }))
    ).not.toThrow();
  });

  it('renders with a different brand', () => {
    render(
      <RewardCard
        brandLogo="/logos/cheetos.png"
        backgroundImage="/backgrounds/cheetos-bg.png"
        brandName="Cheetos"
        title="Buy 5 Cheetos products to earn 1 for 1¢"
        expiryDate="12/31/26"
      />
    );
    expect(screen.getByText('Buy 5 Cheetos products to earn 1 for 1¢')).toBeInTheDocument();
    expect(screen.getByAltText('Cheetos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /activate cheetos reward/i })).toBeInTheDocument();
  });

  it('displays the correct expiry date when changed', () => {
    render(<RewardCard {...defaultProps} expiryDate="06/30/25" />);
    expect(screen.getByText('06/30/25')).toBeInTheDocument();
  });
});
