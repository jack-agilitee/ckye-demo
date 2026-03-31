'use client';

import Image from 'next/image';
import styles from './RewardCard.module.scss';

// Figma asset URLs (served by Figma Dev Mode local server)
const REWARDS_ICON_TOP = 'http://localhost:3845/assets/49f62addef0435fcd0b6c26bf7e80c3e94fa74f0.svg';
const REWARDS_ICON_BOTTOM = 'http://localhost:3845/assets/2ee7469836cd62e0d027d5462ce062d096d74d83.svg';
const CLOCK_ICON = 'http://localhost:3845/assets/970c59f50ce1174ff57e37d04ca6a537e40e9290.svg';

interface RewardCardProps {
  /** Brand logo image URL */
  brandLogo: string;
  /** Full-bleed background image URL for the card */
  backgroundImage: string;
  /** Brand name used for the logo alt text */
  brandName: string;
  /** Offer description displayed on the card */
  title: string;
  /** Expiry date string, e.g. "12/31/26" */
  expiryDate: string;
  /** Called when the Activate button is pressed */
  onActivate?: () => void;
}

const RewardCard = ({
  brandLogo,
  backgroundImage,
  brandName,
  title,
  expiryDate,
  onActivate,
}: RewardCardProps) => {
  const handleActivate = () => {
    // TODO: integrate with rewards activation API
    onActivate?.();
  };

  return (
    <div className={styles['reward-card']}>
      {/* Background image */}
      <Image
        src={backgroundImage}
        alt=""
        fill
        className={styles['reward-card__bg']}
        sizes="343px"
      />

      {/* Header row: logo | activate button | rewards badge */}
      <div className={styles['reward-card__header']}>
        <div className={styles['reward-card__logo']}>
          <Image
            src={brandLogo}
            alt={brandName}
            fill
            className={styles['reward-card__logo-img']}
          />
        </div>

        <button
          className={styles['reward-card__activate-btn']}
          onClick={handleActivate}
          type="button"
          aria-label={`Activate ${brandName} reward`}
        >
          Activate
        </button>

        <div className={styles['reward-card__rewards-badge']}>
          <div className={styles['reward-card__rewards-icon']}>
            <Image
              src={REWARDS_ICON_TOP}
              alt=""
              width={13}
              height={7}
              className={styles['reward-card__rewards-icon-top']}
            />
            <Image
              src={REWARDS_ICON_BOTTOM}
              alt=""
              width={12}
              height={5}
              className={styles['reward-card__rewards-icon-bottom']}
            />
          </div>
          <span className={styles['reward-card__rewards-label']}>Rewards</span>
        </div>
      </div>

      {/* Footer: offer title + expiry */}
      <div className={styles['reward-card__content']}>
        <p className={styles['reward-card__title']}>{title}</p>

        <div className={styles['reward-card__expiry']}>
          <div className={styles['reward-card__clock']}>
            <Image
              src={CLOCK_ICON}
              alt=""
              width={14}
              height={14}
            />
          </div>
          <span className={styles['reward-card__expiry-date']}>{expiryDate}</span>
        </div>
      </div>
    </div>
  );
};

export default RewardCard;
