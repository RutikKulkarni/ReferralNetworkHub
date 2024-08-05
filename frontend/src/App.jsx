import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  About,
  Contact,
  EditAccountInfo,
  Explore,
  ForgotPassword,
  Help,
  Home,
  Login,
  MyAccount,
  NotFound,
  Services,
  Signup
} from './pages/exports'
import { ThemeProvider } from './context/exports'
import { getConfig, isLoggedIn } from "./utility/exports";
import Layout from "./Layout";
import Interactive from "./components/Widget/Interactive/Interactive"

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
          <Interactive />
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

export default App;
