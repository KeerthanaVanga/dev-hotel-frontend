import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";

import type { Review } from "../types/Review";
import ReviewsTable from "../components/reviews/ReviewsTable";
import ReviewsTableSkeleton from "../components/reviews/ReviewsTableSkeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { getReviews } from "../api/review.api";

const ITEMS_PER_PAGE = 4;

function dateOnly(iso: string) {
  return iso.split("T")[0];
}

export default function ReviewsPage() {
  const [page, setPage] = useState(1);

  const {
    data: reviews = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    select: (response): Review[] =>
      response.data.map((r) => ({
        id: r.id,
        userName: r.users.name,
        roomType: r.rooms.room_name,
        rating: r.rating,
        comment: r.comment || "—",
        date: dateOnly(r.created_at),
      })),
  });

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return reviews.slice(start, start + ITEMS_PER_PAGE);
  }, [page, reviews]);

  /* ---------- Error ---------- */
  if (isError) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Guest Reviews</h1>
        <p className="text-red-400">
          {(error as Error)?.message || "Failed to load reviews"}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">Guest Reviews</h1>

      {isLoading ? (
        <ReviewsTableSkeleton />
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
          <EmptyState
            title="No reviews yet"
            description="Guest reviews will appear here once guests start leaving feedback."
            icon={<Star className="h-8 w-8 text-[#D4AF37]" />}
          />
        </div>
      ) : (
        <>
          <ReviewsTable reviews={paginatedReviews} />

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </section>
  );
}
