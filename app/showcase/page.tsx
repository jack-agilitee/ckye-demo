'use client';

import React from 'react';
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';
import styles from './showcase.module.scss';

export default function ShowcasePage() {
  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1>Component Showcase</h1>
        <p>Interactive component library organized by Atomic Design principles</p>
      </header>

      <main className={styles.showcase__section}>
        <h2 className={styles.showcase__sectionTitle}>RewardsCard</h2>
        <p className={styles.showcase__sectionDescription}>
          Molecule — displays a punch-card style loyalty reward with brand logo, progress tracker, title, and expiration date.
        </p>

        <div className={styles.showcase__grid}>
          <div className={styles.showcaseItem}>
            <span className={styles.showcaseItem__label}>2 of 5 Purchased</span>
            <div className={styles.showcaseItem__preview}>
              <RewardsCard
                title="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                purchasedPunches={2}
                expirationDate="12/31/26"
                backgroundImage="/rewards-card/background.png"
                logoSrc="/rewards-card/logo.png"
              />
            </div>
          </div>

          <div className={styles.showcaseItem}>
            <span className={styles.showcaseItem__label}>4 of 5 Purchased</span>
            <div className={styles.showcaseItem__preview}>
              <RewardsCard
                title="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                purchasedPunches={4}
                expirationDate="12/31/26"
                backgroundImage="/rewards-card/background.png"
                logoSrc="/rewards-card/logo.png"
              />
            </div>
          </div>

          <div className={styles.showcaseItem}>
            <span className={styles.showcaseItem__label}>All Completed</span>
            <div className={styles.showcaseItem__preview}>
              <RewardsCard
                title="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                purchasedPunches={5}
                expirationDate="12/31/26"
                backgroundImage="/rewards-card/background.png"
                logoSrc="/rewards-card/logo.png"
                onClick={() => alert('Claim your reward!')}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
