import axiosInstance from "../lib/axios-interceptor";

export type ApiReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;

  users: {
    user_id: number;
    name: string;
  };

  rooms: {
    room_id: number;
    room_name: string;
  };
};

export type GetReviewsResponse = {
  success: boolean;
  count: number;
  data: ApiReview[];
};

export async function getReviews() {
  const res = await axiosInstance.get<GetReviewsResponse>("/reviews/reviews");

  if (!res.data.success) {
    throw new Error("Failed to fetch reviews");
  }

  return res.data;
}
