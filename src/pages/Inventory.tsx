import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import InventoryCard from "../components/inventory/InventoryCard";
import InventorySkeleton from "../components/inventory/InventorySkeleton";
import EmptyState from "../components/ui/EmptyState";

import { searchInventory } from "../api/inventory.api";
import type { HotelInventory } from "../types/Inventory";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<{
    q: string;
    checkIn?: string;
    checkOut?: string;
    adults?: number;
  } | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", searchParams],
    queryFn: () => searchInventory(searchParams!),
    enabled: !!searchParams,
  });

  const properties: HotelInventory[] = data?.properties ?? [];

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchParams({ q: query.trim(), adults: 2 });
  };

  return (
    <section className="space-y-6 min-w-0">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-3 text-[#F5DEB3]/60"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search hotels, places..."
            className="w-full rounded-lg bg-[#241217] border border-[#3A1A22] pl-10 pr-4 py-2 text-[#F5DEB3] focus:border-[#D4AF37] outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          className="rounded-lg bg-[#D4AF37] px-6 py-2 font-medium text-[#1B0F12] hover:opacity-90"
        >
          Search
        </button>
      </div>

      {!searchParams && (
        <EmptyState
          title="Search hotel inventory"
          description="Find hotels across platforms like Expedia, Booking.com, Goibibo & more."
        />
      )}

      {isLoading && <InventorySkeleton />}

      <div className="space-y-4">
        {properties.map((hotel) => (
          <InventoryCard
            key={hotel.id}
            hotel={hotel}
            onViewDetails={() => {
              // pass q so details can fetch properly
              navigate(`/inventory/${hotel.propertyToken}`, {
                state: {
                  q: searchParams?.q,
                  adults: searchParams?.adults ?? 2,
                },
              });
            }}
          />
        ))}
      </div>
    </section>
  );
}
