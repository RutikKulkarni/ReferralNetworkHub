import React from 'react';
import Card from '../../components/Card/Card';
import styles from './Explore.module.css';

const Explore = () => {
  const cardsData = [
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
  ];

  return (
    <div className={styles.exploreWrapper}>
      <div className={styles.explore}>
        <h1 className={styles.heading}>Explore</h1>
        <div className={styles.cardContainer}>
          {cardsData.map((card, index) => (
            <Card key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
