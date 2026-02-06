import api from "../lib/axios-interceptor";

export const signup = (data: {
  username: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/signup", data);
};

export const login = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export const me = () => {
  return api.get("/auth/me");
};
