import React from 'react';
import Card from '../../components/Card/Card';
import styles from './Explore.module.css';
import { IoArrowForward } from "react-icons/io5";

const Explore = () => {
  const cardData = [
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
    { name: 'John Doe', title: 'Software Engineer - 1', company: 'Company Logo' },
  ];

  return (
    <>
    <div className={styles.exploreWrapper}>
      <div className={styles.mainText}>
        <h1>Explore</h1>
        <IoArrowForward className={styles.arrowIcon}/>
      </div>
      <div className={styles.gridContainer}>
        {cardData.map((card, index) => (
          <div key={index} className={styles.gridItem}>
            <Card {...card} />
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Explore;
