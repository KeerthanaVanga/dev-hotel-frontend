import type { HotelInventory } from "../../types/Inventory";
import { Star } from "lucide-react";

export default function InventoryCard({
  hotel,
  onViewDetails,
}: {
  hotel: HotelInventory;
  onViewDetails: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 rounded-xl border border-[#3A1A22] bg-[#241217] p-4 hover:border-[#D4AF37] transition">
      <img
        src={hotel.image}
        className="h-40 w-full md:w-56 rounded-lg object-cover"
      />

      <div className="flex-1 space-y-2 min-w-0">
        <h3 className="text-lg font-semibold text-[#F5DEB3]">{hotel.name}</h3>

        <div className="flex items-center gap-2 text-sm text-[#F5DEB3]/70">
          <Star size={14} className="text-yellow-400" />
          <span>{hotel.rating}</span>
          <span>({hotel.reviews})</span>
          <span>• {hotel.type}</span>
        </div>

        <div className="flex flex-wrap gap-2 max-w-full">
          {hotel.amenities.slice(0, 8).map((a) => (
            <span
              key={a}
              className="rounded-full bg-[#3A1A22] px-2 py-1 text-xs text-[#F5DEB3]/80"
            >
              {a}
            </span>
          ))}
          {hotel.amenities.length > 8 && (
            <span className="rounded-full bg-[#3A1A22]/60 px-2 py-1 text-xs text-[#F5DEB3]/70">
              +{hotel.amenities.length - 8} more
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <span className="text-xl font-semibold text-[#D4AF37]">
          ₹{hotel.price}
        </span>
        <button
          onClick={onViewDetails}
          className="rounded-md bg-[#D4AF37] px-4 py-2 text-[#1B0F12] font-medium hover:opacity-90"
        >
          View details
        </button>
      </div>
    </div>
  );
}
