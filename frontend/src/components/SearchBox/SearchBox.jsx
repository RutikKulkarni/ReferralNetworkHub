// import { useState, LuSearch, styles } from "./imports/index";

// /**
//  * SearchBox component allows users to input a search query.
//  *
//  * @component
//  * @param {Object} props - The properties object.
//  * @param {function} props.onSearch - The callback function to handle the search query.
//  * @returns {JSX.Element} The SearchBox component.
//  */
// const SearchBox = ({ onSearch }) => {
//   const [query, setQuery] = useState("");

//   /**
//    * Handles the change in the input field and triggers the onSearch callback.
//    *
//    * @param {Object} e - The event object.
//    */

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     onSearch(e.target.value);
//   };

//   return (
//     <div className={styles.searchBoxWrapper}>
//       <div className={styles.group}>
//         <LuSearch className={styles.searchIcon} />
//         <input
//           type="text"
//           value={query}
//           onChange={handleInputChange}
//           className={styles.input}
//           placeholder="Search..."
//         />
//       </div>
//     </div>
//   );
// };

// export default SearchBox;

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
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Handles the change in the input field and triggers the onSearch callback.
   *
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  /**
   * Toggles the search box visibility on mobile view.
   */
  const toggleSearchBox = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.searchBoxWrapper} ${
        isExpanded ? styles.expanded : ""
      }`}
    >
      <div className={styles.group}>
        <LuSearch className={styles.searchIcon} onClick={toggleSearchBox} />
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
