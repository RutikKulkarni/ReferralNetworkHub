import { isLoggedIn } from "./userPersistence";

const handleNavigate = (path, navigate) => {
  const redirects = {
    home: "/",
    about: "/about",
    services: "/services",
    help: "/help",
    contact: "/contact",
    login: "/login",
    signup: "/signup",
    explore: "/explore",
    editAccountInfo: "/editAccountInfo",
    myAccount: "/myAccount",
    forgotpassword: "/forgotpassword",
  };

  if (
    !isLoggedIn() &&
    (path === "myAccount" || path === "editAccountInfo" || path === "explore")
  ) {
    navigate("/login");
  } else if (isLoggedIn() && (path === "login" || path === "signup")) {
    navigate("/explore");
  } else {
    navigate(redirects[path]);
  }
};

export { handleNavigate };
