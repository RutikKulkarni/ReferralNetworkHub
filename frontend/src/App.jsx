import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/Page404/Page404"
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Help from "./pages/Help/Help";
import Contact from "./pages/Contact/Contact";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Forgot/Forgot"
import MyAccount from "./pages/MyAccount/MyAccount";
import EditAccountInfo from "./pages/EditAccountInfo/EditAccountInfo";
import Explore from "./pages/Explore/Explore";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import { getConfig } from "./utility/envHelper/envHelper";
import Layout from "./Layout";

export const Config = getConfig();

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
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/myAccount" element={<MyAccount />} />
        <Route
          path="/editAccountInfo"
          element={<EditAccountInfo />}
        />
        <Route path="/explore" element={<Explore />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Layout>
    </ThemeProvider>
  </Router>
  );
}

export default App;
