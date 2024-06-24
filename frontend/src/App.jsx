import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NotFound from "./pages/Page404/Page404";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import Help from "./pages/Help/Help";
import Contact from "./pages/Contact/Contact";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Forgot/Forgot";
import MyAccount from "./pages/MyAccount/MyAccount";
import EditAccountInfo from "./pages/EditAccountInfo/EditAccountInfo";
import Explore from "./pages/Explore/Explore";
import ThemeProvider from "./context/ThemeProvider/ThemeProvider";
import { getConfig } from "./utility/envHelper/envHelper";
import Layout from "./Layout";
import { isLoggedIn } from "./utility/userPersistence";
// import { handleNavigate } from "./utility/handleRedirections";

export const Config = getConfig();

const PrivateRoute = ({ element, ...rest }) => {
  return isLoggedIn() ? element : <Navigate to="/login" />;
};

const RedirectIfLoggedIn = ({ element, ...rest }) => {
  return isLoggedIn() ? <Navigate to="/explore" /> : element;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={isLoggedIn() ? <Navigate to="/explore" /> : <Home />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/signup"
              element={<RedirectIfLoggedIn element={<Signup />} />}
            />
            <Route
              path="/login"
              element={<RedirectIfLoggedIn element={<Login />} />}
            />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route
              path="/myAccount"
              element={<PrivateRoute element={<MyAccount />} />}
            />
            <Route
              path="/editAccountInfo"
              element={<PrivateRoute element={<EditAccountInfo />} />}
            />
            <Route
              path="/explore"
              element={<PrivateRoute element={<Explore />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;
