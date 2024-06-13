import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import Widget from "../../components/Widget/User/User";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const Home = () => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

  const toggleWidgetVisibility = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <div>
      <Navbar toggleWidgetVisibility={toggleWidgetVisibility} />
      {isWidgetVisible && <Widget />}
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
