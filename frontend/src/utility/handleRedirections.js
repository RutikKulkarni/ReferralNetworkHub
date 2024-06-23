/**
 * Navigates to the specified path.
 * @param {string} path - Path to navigate to
 */
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
  };

  navigate(redirects[path]);
};

export { handleNavigate };
