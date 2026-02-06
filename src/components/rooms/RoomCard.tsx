import { useNavigate } from "react-router-dom";
import type { Room } from "../../types/Room";

export default function RoomCard({ room }: { room: Room }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/rooms/${room.id}`)}
      className="
        cursor-pointer rounded-xl border border-[#3A1A22]
        bg-[#241217] p-4 transition
        hover:border-[#D4AF37]
      "
    >
      <img
        src={room.images[0]}
        alt={room.name}
        loading="lazy"
        className="h-48 w-full rounded-lg object-cover"
      />

      <div className="mt-4 space-y-1">
        <p className="font-medium text-[#F5DEB3]">{room.name}</p>
        <p className="text-sm text-[#F5DEB3]/60">{room.type}</p>

        <p className="mt-2 text-[#D4AF37] font-semibold">
          ${room.pricePerNight} / night
        </p>
      </div>

      {/* Edit button – NOT a Link */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 👈 VERY IMPORTANT
          navigate(`/rooms/${room.id}/edit`);
        }}
        className="
          mt-4 w-full rounded-md
          border border-[#3A1A22] py-2
          text-sm text-[#F5DEB3]/80
          hover:border-[#D4AF37]
        "
      >
        Edit Room
      </button>
    </div>
  );
}
