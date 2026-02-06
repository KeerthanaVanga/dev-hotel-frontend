import { useParams } from "react-router-dom";
import RoomGallery from "./RoomGallery";
import type { Room } from "../../types/Room";
import RoomDetailedSkeleton from "./skeletons/RoomDetailedSkeleton";
import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../../api/rooms.api";

export default function RoomDetailsPage() {
  const { roomId } = useParams();

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => getRoomById(roomId!),
    enabled: !!roomId,
    select: (r): Room => ({
      id: String(r.room_id),
      name: r.room_name,
      type: r.room_type,
      roomNumber: Number(r.room_number), // ✅ NEW
      totalRooms: Number(r.total_rooms), // ✅ NEW
      pricePerNight: Number(r.price),
      size: r.room_size,
      capacity: r.guests,
      images: r.image_urls,
      description: r.description,
      amenities: r.amenities,
    }),
  });

  if (isLoading) return <RoomDetailedSkeleton />;

  if (isError || !room) {
    return (
      <div className="text-red-400">
        {(error as Error)?.message || "Room not found"}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <RoomGallery images={room.images} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-[#F5DEB3]">{room.name}</h1>
          <p className="text-[#F5DEB3]/60">{room.type}</p>
        </div>

        <p className="text-[#F5DEB3]/80">{room.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-[#F5DEB3]/70">
          <p>🏷 Room No: {room.roomNumber}</p>
          <p>🏨 Total Rooms: {room.totalRooms}</p>
          <p>👤 Capacity: {room.capacity} guests</p>
          <p>📐 Size: {room.size}</p>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-serif text-[#F5DEB3]">Amenities</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm text-[#F5DEB3]/70">
            {room.amenities.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-[#3A1A22] bg-[#1F1216] p-4">
          <p className="text-2xl font-semibold text-[#D4AF37]">
            ₹{room.pricePerNight} / night
          </p>

          <button className="mt-4 w-full rounded-md bg-[#D4AF37] py-3 font-semibold text-[#1B0F12] hover:bg-[#c9a633]">
            Book this room
          </button>
        </div>
      </div>
    </div>
  );
}
