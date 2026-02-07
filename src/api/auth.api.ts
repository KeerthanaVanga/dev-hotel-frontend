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
export interface AdminProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const getProfile = () => {
  return api.get<{ profile: AdminProfile }>("/auth/profile");
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return api.post("/auth/change-password", data);
};
