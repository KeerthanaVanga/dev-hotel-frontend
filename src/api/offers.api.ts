// src/api/offers.api.ts
import axiosInstance from "../lib/axios-interceptor";
import type { Offer, OfferPayload } from "../types/Offers";

/**
 * GET all offers
 * returns Offer[]
 */
export async function getOffers(): Promise<Offer[]> {
  const res = await axiosInstance.get("/offers");
  return res.data.data; // ✅ unwrap here
}

/**
 * GET single offer
 * returns Offer
 */
export async function getOfferById(offerId: number): Promise<Offer> {
  console.log("Fetching offer by ID:", offerId);
  const res = await axiosInstance.get(`/offers/${offerId}`);
  return res.data.data;
}

/**
 * CREATE offer
 */
export async function createOffer(payload: OfferPayload): Promise<Offer> {
  const res = await axiosInstance.post("/offers/create", payload);
  return res.data.data;
}

/**
 * UPDATE offer
 */
export async function updateOffer(
  offerId: string,
  payload: Partial<OfferPayload>,
): Promise<Offer> {
  const res = await axiosInstance.patch(`/offers/${offerId}`, payload);
  return res.data.data;
}

/**
 * DELETE offer
 */
export async function deleteOffer(offerId: number): Promise<void> {
  await axiosInstance.delete(`/offers/${offerId}`);
}
