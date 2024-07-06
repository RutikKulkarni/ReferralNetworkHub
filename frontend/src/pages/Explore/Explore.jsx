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
  const [screenType, setScreenType] = useState("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState(cardData);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setColumns(calculateColumns(width));

      if (width <= 800) {
        setScreenType("mobile");
      } else if (width <= 1349) {
        setScreenType("tablet");
      } else {
        setScreenType("desktop");
      }
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
    <div className={styles.exploreWrapper}>
      <div className={styles.mainText}>
        <div className={styles.contentLeft}>
          <h1>Explore</h1>
          <IoArrowForward className={styles.arrowIcon} />
        </div>
        <div className={styles.contentRight}>
          <SearchBox onSearch={setSearchQuery} />
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <p className={styles.noMatch}>Sorry, no matching results were found</p>
      ) : (
        <>
          <div className={styles.gridContainer}>
            {mainGridCards.map((card, index) => (
              <div key={index} className={styles.gridItem}>
                <Card
                  {...card}
                  name={formatName(card.name, true, screenType, false)}
                />
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
                  <Card
                    {...card}
                    name={formatName(card.name, true, screenType, true)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
