export const calculateColumns = (width) => {

  if (width <= 768) {
    return 1;
  } else if (width <= 1024) {
    return 2;
  } else {
    return 3;
  }
};

export const splitCardsIntoMainAndLeftover = (cards, columns) => {
  const mainGridCards = cards.slice(0, Math.floor(cards.length / columns) * columns);
  const leftoverCards = cards.slice(Math.floor(cards.length / columns) * columns);
  return { mainGridCards, leftoverCards };
};

export const getLeftoverGridClass = (leftoverCount, styles) => {
  if (leftoverCount === 1) return styles.leftoverOne;
  if (leftoverCount === 2) return styles.leftoverTwo;
  return styles.leftoverThree;
};

export const formatName = (name, shouldFormat, screenType, isLeftover) => {
  if (!shouldFormat) return name;

  if (screenType === 'mobile' || (screenType !== 'mobile' && isLeftover)) {
    return name;
  }

  if (name.length <= 20) {
    return name;
  }

  const nameParts = name.split(' ');
  if (nameParts.length === 1) {
    return name; // If there's only one part and it's long, return it as is.
  }

  const firstName = nameParts[0];
  const middleName = nameParts.length > 1 ? nameParts[1] : '';
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
