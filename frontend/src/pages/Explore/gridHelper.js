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

export const formatName = (name) => {
  const words = name.split(" ");

  if (words.length === 2) {
    // If the name has two words
    if (name.length <= 20) {
      return name;
    } else {
      return `${words[0]} ${words[1].charAt(0)}.`;
    }
  } else if (words.length === 3) {
    // If the name has three words
    if (name.length <= 20) {
      return name;
    }
    const shortName = `${words[0]} ${words[1].charAt(0)} ${words[2]}`;
    if (shortName.length <= 20) {
      return shortName;
    } else {
      return `${words[0]} ${words[1].charAt(0)}.${words[2].charAt(0)}.`;
    }
  }

  return name;
};
