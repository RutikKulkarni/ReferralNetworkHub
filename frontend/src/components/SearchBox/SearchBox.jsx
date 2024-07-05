// SearchBox.jsx
import { useState, LuSearch, styles } from "./imports/index";

/**
 * SearchBox component allows users to input a search query.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {function} props.onSearch - The callback function to handle the search query.
 * @returns {JSX.Element} The SearchBox component.
 */
const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  /**
   * Handles the change in the input field and triggers the onSearch callback.
   *
   * @param {Object} e - The event object.
   */

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
