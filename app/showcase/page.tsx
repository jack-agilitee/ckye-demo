'use client';

import React from 'react';
import styles from './showcase.module.scss';
import RewardsCard from '@/components/molecules/RewardsCard/RewardsCard';

function ShowcaseNavigation() {
  return (
    <nav className={styles.showcaseNav}>
      <a href="#atoms" className={styles.showcaseNav__link}>Atoms</a>
      <a href="#molecules" className={styles.showcaseNav__link}>Molecules</a>
      <a href="#organisms" className={styles.showcaseNav__link}>Organisms</a>
      <a href="#templates" className={styles.showcaseNav__link}>Templates</a>
    </nav>
  );
}

function CodeExample({ children, language = 'tsx' }: { children: string; language?: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
  };

  return (
    <div className={styles.codeExample}>
      <div className={styles.codeExample__header}>
        <span className={styles.codeExample__language}>{language}</span>
        <button onClick={handleCopy} className={styles.codeExample__button}>
          Copy
        </button>
      </div>
      <pre className={styles.codeExample__block}>
        <code className={styles.codeExample__content}>
          {children.trim()}
        </code>
      </pre>
    </div>
  );
}

function ShowcaseItem({ title, children, code }: { title: string; children: React.ReactNode; code: string }) {
  return (
    <div className={styles.showcaseItem}>
      <h3 className={styles.showcaseItem__title}>{title}</h3>
      <div className={styles.showcaseItem__preview}>
        {children}
      </div>
      <CodeExample>{code}</CodeExample>
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <div className={styles.showcase}>
      <header className={styles.showcase__header}>
        <h1>Component Showcase</h1>
        <p>Interactive component library organized by Atomic Design principles</p>
      </header>

      <ShowcaseNavigation />

      <main className={styles.showcase__content}>
        <section id="atoms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Atoms</h2>
          <p className={styles.showcase__placeholder}>No atoms available yet</p>
        </section>

        <section id="molecules" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Molecules</h2>

          <ShowcaseItem
            title="RewardsCard - In Progress"
            code={`<RewardsCard
  backgroundImageUrl="/rewards-card/rewards-card-bg.png"
  brandLogoUrl="/rewards-card/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={2}
  expirationDate="12/31/26"
  onClick={() => {}}
/>`}
          >
            <div className={styles.showcaseItem__rewardsCardWrapper}>
              <RewardsCard
                backgroundImageUrl="/rewards-card/rewards-card-bg.png"
                brandLogoUrl="/rewards-card/cheetos-logo.png"
                rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                completedPunches={2}
                expirationDate="12/31/26"
                onClick={() => {}}
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem
            title="RewardsCard - With Banked Rewards"
            code={`<RewardsCard
  backgroundImageUrl="/rewards-card/rewards-card-bg.png"
  brandLogoUrl="/rewards-card/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={5}
  expirationDate="12/31/26"
  bankedRewards={2}
  onClick={() => {}}
/>`}
          >
            <div className={styles.showcaseItem__rewardsCardWrapper}>
              <RewardsCard
                backgroundImageUrl="/rewards-card/rewards-card-bg.png"
                brandLogoUrl="/rewards-card/cheetos-logo.png"
                rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                completedPunches={5}
                expirationDate="12/31/26"
                bankedRewards={2}
                onClick={() => {}}
              />
            </div>
          </ShowcaseItem>

          <ShowcaseItem
            title="RewardsCard - Just Started"
            code={`<RewardsCard
  backgroundImageUrl="/rewards-card/rewards-card-bg.png"
  brandLogoUrl="/rewards-card/cheetos-logo.png"
  rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
  totalPunches={5}
  completedPunches={0}
  expirationDate="12/31/26"
  onClick={() => {}}
/>`}
          >
            <div className={styles.showcaseItem__rewardsCardWrapper}>
              <RewardsCard
                backgroundImageUrl="/rewards-card/rewards-card-bg.png"
                brandLogoUrl="/rewards-card/cheetos-logo.png"
                rewardDescription="Buy 5 Cheetos products to earn 1 for 1¢"
                totalPunches={5}
                completedPunches={0}
                expirationDate="12/31/26"
                onClick={() => {}}
              />
            </div>
          </ShowcaseItem>
        </section>

        <section id="organisms" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Organisms</h2>
          <p className={styles.showcase__placeholder}>No organisms available yet</p>
        </section>

        <section id="templates" className={styles.showcase__section}>
          <h2 className={styles.showcase__sectionTitle}>Templates</h2>
          <p className={styles.showcase__placeholder}>No templates available yet</p>
        </section>
      </main>
    </div>
  );
}
