import RoomCard from "../components/rooms/RoomCard";
import type { Room } from "../types/Room";
import { useNavigate } from "react-router-dom";
import RoomsPageSkeleton from "../components/rooms/skeletons/RoomsPageSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api/rooms.api";

export default function RoomsPage() {
  const navigate = useNavigate();

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    select: (response): Room[] =>
      response.data.map((r) => ({
        id: String(r.room_id),
        name: r.room_name,
        type: r.room_type,
        roomNumber: Number(r.room_number), // ✅ NEW
        totalRooms: Number(r.total_rooms),
        pricePerNight: Number(r.price),
        size: r.room_size,
        capacity: r.guests,
        images: r.image_urls,
        description: r.description,
        amenities: r.amenities,
      })),
  });

  if (isLoading) return <RoomsPageSkeleton />;

  if (isError) {
    return (
      <div className="text-red-400">
        {(error as Error).message || "Failed to load rooms"}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#F5DEB3]">Rooms</h1>

        <button
          onClick={() => navigate("/rooms/new")}
          className="rounded-md bg-[#D4AF37] px-4 py-2 font-semibold text-[#1B0F12] hover:bg-[#c9a633]"
        >
          Add Room
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  );
}
