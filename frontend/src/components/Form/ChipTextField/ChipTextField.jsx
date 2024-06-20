import React, { useState } from 'react';
import styles from './ChipTextField.module.css';

const ChipTextField = ({placeholder}) => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (inputValue.trim() !== '') {
        setChips([...chips, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  const handleDelete = (chipToDelete) => {
    setChips(chips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <div className={styles.chipInputContainer}>
      {chips.map((chip, index) => (
        <div key={index} className={styles.chip}>
          {chip}
          <button onClick={() => handleDelete(chip)} className={styles.chipDeleteButton}>
            &times;
          </button>
        </div>
      ))}
      <input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.chipInput}
      />
    </div>
  );
};

export default ChipTextField;
