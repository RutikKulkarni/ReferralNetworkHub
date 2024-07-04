/**
 * Determines the number of columns based on the screen width.
 *
 * @param {number} width - The width of the screen in pixels.
 * @returns {number} - The number of columns to display.
 */
export const calculateColumns = (width) => {
  if (width <= 768) {
    return 1;
  } else if (width <= 1024) {
    return 2;
  } else {
    return 3;
  }
};

/**
 * Splits cards into main grid cards and leftover cards based on the number of columns.
 *
 * @param {Array} cards - The array of card objects.
 * @param {number} columns - The number of columns in the grid.
 * @returns {Object} - An object containing arrays of mainGridCards and leftoverCards.
 */
export const splitCardsIntoMainAndLeftover = (cards, columns) => {
  const mainGridCards = cards.slice(
    0,
    Math.floor(cards.length / columns) * columns
  );
  const leftoverCards = cards.slice(
    Math.floor(cards.length / columns) * columns
  );
  return { mainGridCards, leftoverCards };
};

/**
 * Returns the appropriate CSS class based on the number of leftover cards.
 *
 * @param {number} leftoverCount - The number of leftover cards.
 * @param {Object} styles - The styles object containing CSS class names.
 * @returns {string} - The CSS class name for the leftover cards grid.
 */
export const getLeftoverGridClass = (leftoverCount, styles) => {
  if (leftoverCount === 1) return styles.leftoverOne;
  if (leftoverCount === 2) return styles.leftoverTwo;
  return styles.leftoverThree;
};

/**
 * Formats a name based on specified conditions.
 *
 * @param {string} name - The name to format.
 * @param {boolean} shouldFormat - Whether the name should be formatted.
 * @param {string} screenType - The type of screen (e.g., 'mobile', 'desktop').
 * @param {boolean} isLeftover - Whether the name is part of the leftover grid.
 * @returns {string} - The formatted name.
 */
export const formatName = (name, shouldFormat, screenType, isLeftover) => {
  if (!shouldFormat) return name;

  if (screenType === "mobile" || (screenType !== "mobile" && isLeftover)) {
    return name;
  }

  if (name.length <= 20) {
    return name;
  }

  const nameParts = name.split(" ");
  if (nameParts.length === 1) {
    return name; // If there's only one part and it's long, return it as is.
  }

  const firstName = nameParts[0];
  const middleName = nameParts.length > 1 ? nameParts[1] : "";
  const lastName = nameParts[nameParts.length - 1];

  if (nameParts.length > 3) {
    return `${firstName} ${middleName[0].toUpperCase()}. ${lastName[0].toUpperCase()}.`;
  }

  let formattedName = `${firstName} ${middleName} ${lastName}`;

  if (formattedName.length > 20) {
    formattedName = `${firstName} ${middleName[0].toUpperCase()}. ${lastName[0].toUpperCase()}.`;
  }

  return formattedName;
};
