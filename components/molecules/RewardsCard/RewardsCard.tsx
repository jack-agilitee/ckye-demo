'use client';

import React from 'react';
import Image from 'next/image';
import styles from './RewardsCard.module.scss';

interface RewardsCardProps {
  variant: 'activated' | 'explore';
  brandLogoSrc: string;
  backgroundImageSrc: string;
  description: string;
  expirationDate: string;
  purchasedCount?: number;
  requiredCount?: number;
  bankedRewards?: number;
  onActivate?: () => void;
  onClick?: () => void;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  variant,
  brandLogoSrc,
  backgroundImageSrc,
  description,
  expirationDate,
  purchasedCount = 0,
  requiredCount = 0,
  bankedRewards = 0,
  onActivate,
  onClick,
}) => {
  const clampedPurchased = Math.min(purchasedCount, requiredCount);

  const handleActivateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onActivate?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  const renderPunchCircles = () => {
    const circles = [];
    for (let i = 0; i < requiredCount; i++) {
      const isFilled = i < clampedPurchased;
      circles.push(
        <Image
          key={`punch-${i}`}
          src={isFilled ? '/rewards-card/punch-circle-filled.svg' : '/rewards-card/punch-circle-empty.svg'}
          alt={isFilled ? 'Purchased' : 'Remaining'}
          width={16}
          height={16}
          className={styles['rewards-card__punch-circle']}
          unoptimized
        />
      );
    }
    return circles;
  };

  const cardClasses = [
    styles['rewards-card'],
    onClick ? styles['rewards-card--clickable'] : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      role="article"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
    >
      {/* Background image */}
      <Image
        src={backgroundImageSrc}
        alt=""
        fill
        className={styles['rewards-card__background']}
        sizes="269px"
        priority={false}
      />

      {/* Top bar */}
      <div className={styles['rewards-card__top-bar']}>
        {/* Brand logo */}
        <div className={styles['rewards-card__logo']}>
          <Image
            src={brandLogoSrc}
            alt="Brand logo"
            width={48}
            height={30}
            className={styles['rewards-card__logo-image']}
          />
        </div>

        {/* Center: tracker (activated) or activate button (explore) */}
        {variant === 'activated' && requiredCount > 0 && (
          <div className={styles['rewards-card__tracker']}>
            <div className={styles['rewards-card__punch-group']}>
              {renderPunchCircles()}
            </div>
            <span className={styles['rewards-card__tracker-label']}>
              {clampedPurchased} of {requiredCount} Purchased
            </span>
          </div>
        )}

        {variant === 'explore' && (
          <button
            type="button"
            className={styles['rewards-card__activate-btn']}
            onClick={handleActivateClick}
            aria-label="Activate reward"
          >
            Activate
          </button>
        )}

        {/* Rewards badge */}
        <div className={styles['rewards-card__badge']}>
          <Image
            src="/rewards-card/rewards-star.svg"
            alt=""
            width={16}
            height={16}
            className={styles['rewards-card__badge-icon']}
            unoptimized
          />
          <span className={styles['rewards-card__badge-text']}>Rewards</span>
        </div>
      </div>

      {/* Banked rewards badge */}
      {variant === 'activated' && bankedRewards > 0 && (
        <span className={styles['rewards-card__banked']}>
          +{bankedRewards}
        </span>
      )}

      {/* Bottom content */}
      <div className={styles['rewards-card__content']}>
        <p className={styles['rewards-card__description']}>{description}</p>
        <div className={styles['rewards-card__expiry']}>
          <Image
            src="/rewards-card/clock-icon.svg"
            alt=""
            width={14}
            height={14}
            className={styles['rewards-card__expiry-icon']}
            unoptimized
          />
          <span className={styles['rewards-card__expiry-text']}>{expirationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RewardsCard;
