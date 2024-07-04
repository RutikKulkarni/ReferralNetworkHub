// SearchBox.jsx
import React, { useState } from 'react';
import styles from './DesktopSearchBox.module.css';
import { LuSearch } from "react-icons/lu";

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.inputWrapper}>
      <button className={styles.icon}>
        <LuSearch className={styles.searchIcon} />
      </button>
      <input 
        placeholder="search.."
        className={styles.input}
        name="text"
        type="text"
        value={query}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBox;