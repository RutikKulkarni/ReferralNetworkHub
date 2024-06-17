import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Help from "./pages/Help/Help";
import Contact from "./pages/Contact/Contact";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import MyAccount from "./pages/MyAccount/MyAccount";
import EditAccountInfo from "./pages/EditAccountInfo/EditAccountInfo";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";

// If you are developing then set this to 'development', if you are pushing your code make sure it is set to 'deployment'
const REACT_ENV = "deployment";

export const Config = {
  endpoint:
    REACT_ENV === "development"
      ? "http://localhost:8082/api/"
      : REACT_ENV === "deployment"
      ? "https://referralnetworkhub.onrender.com/api/"
      : "",
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myAccount" element={<MyAccount />} />
            <Route path="/editAccountInfo" element={<EditAccountInfo />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
