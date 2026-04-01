'use client';

import React from 'react';
import Image from 'next/image';
import styles from './RewardsCard.module.scss';

export interface RewardsCardProps {
  title: string;
  totalPunches?: number;
  purchasedPunches?: number;
  expirationDate: string;
  backgroundImage: string;
  logoSrc: string;
  logoAlt?: string;
  onClick?: () => void;
}

const RewardsCard: React.FC<RewardsCardProps> = ({
  title,
  totalPunches = 5,
  purchasedPunches = 0,
  expirationDate,
  backgroundImage,
  logoSrc,
  logoAlt = 'Brand logo',
  onClick,
}) => {
  const clampedPurchased = Math.min(purchasedPunches, totalPunches);

  return (
    <div
      className={styles['rewards-card']}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      aria-label={onClick ? `Rewards card: ${title}` : undefined}
    >
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className={styles['rewards-card__bg']}
        priority
        sizes="(max-width: 768px) 100vw, 295px"
      />

      {/* Top bar */}
      <div className={styles['rewards-card__top']}>
        {/* Brand logo */}
        <div className={styles['rewards-card__logo-wrap']}>
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={60}
            height={30}
            className={styles['rewards-card__logo']}
          />
        </div>

        {/* Punch tracker */}
        <div className={styles['rewards-card__tracker']}>
          <div className={styles['rewards-card__punch-group']} aria-label={`${clampedPurchased} of ${totalPunches} punches`}>
            {Array.from({ length: totalPunches }, (_, i) => {
              const isFilled = i < clampedPurchased;
              return (
                <Image
                  key={i}
                  src={isFilled ? '/rewards-card/punch-filled.svg' : '/rewards-card/punch-empty.svg'}
                  alt={isFilled ? 'Punch filled' : 'Punch empty'}
                  width={16}
                  height={16}
                  className={styles['rewards-card__punch']}
                />
              );
            })}
          </div>
          <p className={styles['rewards-card__progress-text']}>
            {clampedPurchased} of {totalPunches} Purchased
          </p>
        </div>

        {/* Rewards label */}
        <div className={styles['rewards-card__rewards-label']}>
          <Image
            src="/rewards-card/rewards-icon.svg"
            alt=""
            width={21}
            height={19}
            className={styles['rewards-card__rewards-icon']}
            aria-hidden="true"
          />
          <span className={styles['rewards-card__rewards-text']}>Rewards</span>
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles['rewards-card__bottom']}>
        <p className={styles['rewards-card__title']}>{title}</p>

        <div className={styles['rewards-card__expiration']}>
          <Image
            src="/rewards-card/clock-icon.svg"
            alt=""
            width={14}
            height={14}
            className={styles['rewards-card__clock-icon']}
            aria-hidden="true"
          />
          <span className={styles['rewards-card__expiration-date']}>{expirationDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RewardsCard;
