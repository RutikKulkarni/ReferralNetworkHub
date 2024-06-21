import React from 'react';
import styles from './Card.module.css';

const Card = ({ name, title, company }) => {
  return (
    <div className={styles.card}>
      <img src="profile-pic-url" alt="profile" className={styles.profilePic} />
      <div className={styles.details}>
        <div className={styles.info}>
          <h2>{name}</h2>
          <p>{title}</p>
        </div>
        {company && <p className={styles.company}>{company}</p>}
      </div>
    </div>
  );
};

export default Card;
