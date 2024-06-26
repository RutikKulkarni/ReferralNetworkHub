import {
  exploreStyles as styles,
  useState,
  useEffect,
  Card,
  IoArrowForward,
  calculateColumns,
  getLeftoverGridClass,
  splitCardsIntoMainAndLeftover,
  cardData,
  formatName,
} from "./imports";

const Explore = () => {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { mainGridCards, leftoverCards } = splitCardsIntoMainAndLeftover(
    cardData,
    columns
  );

  return (
    <>
      <div className={styles.exploreWrapper}>
        <div className={styles.mainText}>
          <h1>Explore</h1>
          <IoArrowForward className={styles.arrowIcon} />
        </div>
        <div className={styles.gridContainer}>
          {mainGridCards.map((card, index) => (
            <div key={index} className={styles.gridItem}>
              <Card {...card} name={formatName(card.name)} />
            </div>
          ))}
        </div>
        {leftoverCards.length > 0 && columns > 1 && (
          <div
            className={`${styles.leftoverGrid} ${getLeftoverGridClass(
              leftoverCards.length,
              styles
            )}`}
          >
            {leftoverCards.map((card, index) => (
              <div key={index} className={styles.gridItem}>
                <Card {...card} name={formatName(card.name)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
