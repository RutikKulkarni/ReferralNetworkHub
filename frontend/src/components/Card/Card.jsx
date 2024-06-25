import { cardStyles as styles } from "./imports";

const Card = ({ name, title, company, img }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={img} alt="profile" />
      </div>

      <div className={styles.info}>
        <h2>{name}</h2>
        <p>{title}</p>
      </div>

      <div className={styles.companyDetails}>
        {company && <p className={styles.company}>{company}</p>}
      </div>
    </div>
  );
};

export default Card;
