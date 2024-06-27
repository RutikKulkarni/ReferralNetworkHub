import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import styles from "./SearchBox.module.css";

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.searchBoxWrapper}>
      <div className={styles.group}>
        <LuSearch className={styles.searchIcon} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Search..."
        />
      </div>
    </div>
  );
};

export default SearchBox;
