import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Services.module.css";

const Services = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.services}>
        <h1>Services Page</h1>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
