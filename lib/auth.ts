import Cookies from "js-cookie";

export const setToken = (token: string) => {
  // Save to localStorage for Axios interceptor
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
  
  // Save to cookie for Middleware (proxy.ts)
  Cookies.set("token", token, { expires: 7, path: "/" });
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  Cookies.remove("token", { path: "/" });
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || Cookies.get("token");
  }
  return Cookies.get("token");
};
