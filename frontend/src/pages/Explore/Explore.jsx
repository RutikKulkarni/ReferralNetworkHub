import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import styles from './Explore.module.css';
import { IoArrowForward } from "react-icons/io5";
import { calculateColumns, splitCardsIntoMainAndLeftover, getLeftoverGridClass } from './gridHelper';

const Explore = () => {
  const cardData = [
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' }
  ];

  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { mainGridCards, leftoverCards } = splitCardsIntoMainAndLeftover(cardData, columns);

  return (
    <>
      <div className={styles.exploreWrapper}>
        <div className={styles.mainText}>
          <h1>Explore</h1>
          <IoArrowForward className={styles.arrowIcon} />
        </div>
        <div className={styles.gridContainer}>
          {mainGridCards.map((card, index) => (
            <div key={index} className={styles.gridItem}>
              <Card {...card} />
            </div>
          ))}
        </div>
        {leftoverCards.length > 0 && columns > 1 && (
          <div className={`${styles.leftoverGrid} ${getLeftoverGridClass(leftoverCards.length, styles)}`}>
            {leftoverCards.map((card, index) => (
              <div key={index} className={styles.gridItem}>
                <Card {...card} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
