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
import { BgLayout } from "./components/BgComponent/BgComponent";

export const Config = getConfig();

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={BgLayout(Home)()} />
          <Route path="/about" element={BgLayout(About)()} />
          <Route path="/services" element={BgLayout(Services)()} />
          <Route path="/help" element={BgLayout(Help)()} />
          <Route path="/contact" element={BgLayout(Contact)()} />
          <Route path="/signup" element={BgLayout(Signup)()} />
          <Route path="/login" element={BgLayout(Login)()} />
          <Route path="/forgotpassword" element={BgLayout(ForgotPassword)()} />
          <Route path="/myAccount" element={BgLayout(MyAccount)()} />
          <Route
            path="/editAccountInfo"
            element={BgLayout(EditAccountInfo)()}
          />
          <Route path="/explore" element={BgLayout(Explore)()} />
          <Route path="*" element={BgLayout(NotFound)()} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
