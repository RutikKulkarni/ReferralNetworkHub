import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      ? "http://localhost:1001/api/"
      : REACT_ENV === "deployment"
      ? "https://referralnetworkhub.onrender.com/api/"
      : "",
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Routes>
          {/* Route for the Home page */}
          <Route path="/" element={<Home />} />
          {/* Route for the About page */}
          <Route path="/about" element={<About />} />
          {/* Route for the Services page */}
          <Route path="/services" element={<Services />} />
          {/* Route for the Help page */}
          <Route path="/help" element={<Help />} />
          {/* Route for the Contact page */}
          <Route path="/contact" element={<Contact />} />
          {/* Route for the Signup page */}
          <Route path="/signup" element={<Signup />} />
          {/* Route for the Login page */}
          <Route path="/login" element={<Login />} />
          {/* Route for the MyAccount page */}
          <Route path="/MyAccount" element={<MyAccount />} />
          {/* Route for the EditAccountInfo.module.css page */}
          <Route path="/EditAccountInfo" element={<EditAccountInfo />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
