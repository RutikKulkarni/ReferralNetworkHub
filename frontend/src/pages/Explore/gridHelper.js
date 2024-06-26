export const calculateColumns = (windowWidth) => {
  if (windowWidth <= 768) {
    return 1;
  } else if (windowWidth <= 1024) {
    return 2;
  } else {
    return 3;
  }
};

export const splitCardsIntoMainAndLeftover = (cardData, columns) => {
  const mainGridCards = cardData.slice(
    0,
    Math.floor(cardData.length / columns) * columns
  );
  const leftoverCards = cardData.slice(
    Math.floor(cardData.length / columns) * columns
  );
  return { mainGridCards, leftoverCards };
};

export const getLeftoverGridClass = (count, styles) => {
  if (count === 1) {
    return styles.leftoverOne;
  } else if (count === 2) {
    return styles.leftoverTwo;
  }
  return "";
};