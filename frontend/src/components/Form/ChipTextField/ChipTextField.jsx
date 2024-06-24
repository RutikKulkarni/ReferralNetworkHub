import React, { useState } from "react";
import styles from "./ChipTextField.module.css";

const ChipTextField = ({ placeholder, inputName, chips, setChips }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      if (inputValue.trim() !== "") {
        setChips((prev) => ({
          ...prev,
          [inputName]: [...chips, inputValue.trim()],
        }));
        setInputValue("");
      }
    }
  };

  const handleDelete = (chipToDelete) => {
    let filteredChips = chips?.filter((chip) => chip !== chipToDelete);
    setChips((prev) => ({
      ...prev,
      [inputName]: filteredChips,
    }));
  };

  return (
    <div className={styles.chipInputContainer}>
      {chips?.map((chip, index) => (
        <div key={index} className={styles.chip}>
          {chip}
          <button
            onClick={() => handleDelete(chip)}
            className={styles.chipDeleteButton}
          >
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
        name={inputName}
      />
    </div>
  );
};

export default ChipTextField;
