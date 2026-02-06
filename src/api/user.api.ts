// src/api/users.api.ts
import axiosInstance from "../lib/axios-interceptor"; // adjust if your axios instance path differs
import type { AddUserPayload } from "../components/ui/AddUsersModel";
export type ApiUser = {
  user_id: number;
  name: string;
  email: string;
  whatsapp_number: string;
  created_at?: string;
  updated_at?: string;
};

export type GetUsersResponse = {
  success: boolean;
  count: number;
  data: ApiUser[];
};

export async function getUsers() {
  // change URL to whatever your backend route is
  const res = await axiosInstance.get<GetUsersResponse>("/users/users");
  return res.data;
}

export const createUserApi = async (payload: AddUserPayload) => {
  try {
    const res = await axiosInstance.post("/users/add", payload);
    return res.data;
  } catch (err: any) {
    // rethrow with backend message so modal can show it
    throw new Error(err?.response?.data?.message || "Failed to add user");
  }
};

export const updateUserApi = async (
  userId: string,
  payload: AddUserPayload,
) => {
  try {
    const res = await axiosInstance.put(`/users/update/${userId}`, payload);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed to update user");
  }
};
