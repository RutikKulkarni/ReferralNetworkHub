import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Home,
  About,
  Services,
  Help,
  Contact,
  Signup,
  Login,
  ForgotPassword,
  MyAccount,
  EditAccountInfo,
  Explore,
  NotFound,
} from "./pages";
import Layout from "./Layout";
import { ThemeProvider } from './context'
import { getConfig } from './utility'

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
            <Route path="/editAccountInfo" element={<EditAccountInfo />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
