import React from 'react';
import styles from './BgComponent.module.css'; 
import wavylines from '../../../src/assets/png/wavylines.png'; 

const BgComponent = () => {
  return (
    <div className={styles.bg}> 
      <div className={styles.skyBlueCircle}></div>
      <img src={wavylines} alt="Wavy Lines" className={styles.line1}/> 
      <img src={wavylines} alt="Wavy Lines" className={styles.line2}/> 
      <img src={wavylines} alt="Wavy Lines" className={styles.line3}/> 
      <div className={styles.yellowCircle}></div>
      <div className={styles.purpleCircle}></div>
      <div className={styles.redCircle}></div>
      <div className={styles.greenCircle}></div>
      <div className={styles.darkskyBlueCircle}></div>
      <div className={styles.BlueSquare}></div>
    </div>
  );
};

export default BgComponent;
