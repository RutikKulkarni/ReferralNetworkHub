import {
  exploreStyles as styles,
  useState,
  useEffect,
  Card,
  IoArrowForward,
  calculateColumns,
  getLeftoverGridClass,
  splitCardsIntoMainAndLeftover,
  SearchBox,
  cardData,
  formatName,
} from "./imports";

const Explore = () => {
  const [columns, setColumns] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState(cardData);

  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const filtered = cardData.filter(
      (card) =>
        card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [searchQuery]);

  const { mainGridCards, leftoverCards } = splitCardsIntoMainAndLeftover(
    filteredCards,
    columns
  );

  return (
    <>
      <div className={styles.exploreWrapper}>
        <div className={styles.mainText}>
          <div className={styles.leftContainer}>
            <h1>Explore</h1>
            <IoArrowForward className={styles.arrowIcon} />
          </div>
          <SearchBox onSearch={setSearchQuery} />
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
