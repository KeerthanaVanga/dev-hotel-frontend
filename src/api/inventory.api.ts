import axiosInstance from "../lib/axios-interceptor";

export const searchInventory = async (params: {
  q: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
}) => {
  const res = await axiosInstance.get("/inventory/search", { params });
  return res.data.data;
};

export const getInventoryDetails = async (params: {
  q: string;
  propertyToken: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
}) => {
  const { propertyToken, ...rest } = params;
  const res = await axiosInstance.get(`/inventory/details/${propertyToken}`, {
    params: rest,
  });
  return res.data.data;
};
