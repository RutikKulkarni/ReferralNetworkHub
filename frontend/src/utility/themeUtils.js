export const setTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

export const getTheme = () => {
  return localStorage.getItem("theme") || "light";
};

export const getDeviceTheme = () => {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  return darkThemeMq.matches ? "dark" : "light";
};
