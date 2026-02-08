import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, X } from "lucide-react";

import { getInventoryDetails } from "../api/inventory.api";
import type { InventoryDetails } from "../types/InventoryDetails";

type Tab = "overview" | "prices" | "reviews" | "photos" | "about";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function InventoryDetailsPage() {
  const { propertyToken = "" } = useParams();
  const nav = useNavigate();
  const location = useLocation() as any;

  const q: string = location?.state?.q ?? "";
  const defaultAdults: number = location?.state?.adults ?? 2;

  const [tab, setTab] = useState<Tab>("prices");
  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(tomorrowISO());
  const [adults, setAdults] = useState(defaultAdults);

  const enabled = Boolean(q && propertyToken);

  const { data, isLoading, isError } = useQuery<InventoryDetails>({
    queryKey: [
      "inventory-details",
      propertyToken,
      q,
      checkIn,
      checkOut,
      adults,
    ],
    queryFn: () =>
      getInventoryDetails({
        q,
        propertyToken,
        checkIn,
        checkOut,
        adults,
      }),
    enabled,
  });

  const tabs: { key: Tab; label: string }[] = useMemo(
    () => [
      { key: "overview", label: "Overview" },
      { key: "prices", label: "Prices" },
      { key: "reviews", label: "Reviews" },
      { key: "photos", label: "Photos" },
      { key: "about", label: "About" },
    ],
    [],
  );

  if (!enabled) {
    return (
      <section className="space-y-4">
        <p className="text-[#F5DEB3]/80">
          Missing hotel query. Go back and open details from Inventory list.
        </p>
        <button
          onClick={() => nav(-1)}
          className="rounded-md bg-[#D4AF37] px-4 py-2 text-[#1B0F12]"
        >
          Back
        </button>
      </section>
    );
  }

  return (
    <section className="min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-serif text-[#F5DEB3]">
          {data?.name ?? (isLoading ? "Loading..." : "Hotel")}
        </h1>

        <div className="flex items-center gap-2">
          {data?.link && (
            <a
              href={data.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#3A1A22] bg-[#241217] px-4 py-2 text-sm text-[#F5DEB3]/90 hover:border-[#D4AF37]"
            >
              <ExternalLink size={16} />
            </a>
          )}

          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-[#3A1A22] bg-[#241217] px-4 py-2 text-sm text-[#F5DEB3]/90 hover:border-[#D4AF37]"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-[#3A1A22] flex gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-3 text-sm whitespace-nowrap ${
              tab === t.key
                ? "text-[#D4AF37] border-b-2 border-[#D4AF37]"
                : "text-[#F5DEB3]/70 hover:text-[#F5DEB3]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters Row like screenshot */}
      <div className="mt-5 flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#F5DEB3]/70">Check-in</span>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3] outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#F5DEB3]/70">Check-out</span>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3] outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#F5DEB3]/70">Adults</span>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="rounded-md border border-[#3A1A22] bg-[#241217] px-3 py-2 text-sm text-[#F5DEB3] outline-none focus:border-[#D4AF37]"
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading && <DetailsSkeleton />}
        {isError && (
          <p className="text-red-400">Failed to load hotel details</p>
        )}

        {!isLoading && data && tab === "prices" && <PricesTab data={data} />}

        {!isLoading && data && tab === "overview" && (
          <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-5 space-y-3">
            <p className="text-[#F5DEB3]/80">{data.description || "—"}</p>
            <div className="text-sm text-[#F5DEB3]/70 space-y-1">
              <p>{data.address}</p>
              <p>{data.phone}</p>
              <p>
                Check-in: {data.checkInTime || "—"} • Check-out:{" "}
                {data.checkOutTime || "—"}
              </p>
            </div>
          </div>
        )}

        {!isLoading && data && tab === "photos" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.images.slice(0, 12).map((img, idx) => (
              <img
                key={idx}
                src={img.thumbnail}
                className="h-44 w-full rounded-xl object-cover border border-[#3A1A22]"
              />
            ))}
          </div>
        )}

        {!isLoading && data && (tab === "reviews" || tab === "about") && (
          <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-5 text-[#F5DEB3]/70">
            Coming soon.
          </div>
        )}
      </div>
    </section>
  );
}

function PricesTab({ data }: { data: InventoryDetails }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-[#F5DEB3]/70">
        Sponsored • Featured options
      </div>

      <div className="rounded-xl border border-[#3A1A22] bg-[#241217] overflow-hidden">
        {data.featuredPrices.map((fp, idx) => (
          <div key={idx} className="border-b border-[#3A1A22] last:border-b-0">
            {/* Source row */}
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {fp.logo ? (
                  <img src={fp.logo} className="h-8 w-8 rounded bg-white" />
                ) : (
                  <div className="h-8 w-8 rounded bg-[#3A1A22]" />
                )}
                <div className="min-w-0">
                  <p className="text-[#F5DEB3] font-medium truncate">
                    {fp.source}
                  </p>
                  {fp.remarks?.length > 0 && (
                    <p className="text-xs text-[#F5DEB3]/60 truncate">
                      {fp.remarks.join(" • ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {typeof fp.ratePerNight === "number" && (
                  <span className="text-lg font-semibold text-[#F5DEB3]">
                    ₹{fp.ratePerNight.toLocaleString()}
                  </span>
                )}

                <a
                  href={fp.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:opacity-90"
                >
                  Visit site
                </a>
              </div>
            </div>

            {/* Rooms (like screenshot) */}
            {fp.rooms?.length > 0 && (
              <div className="px-4 pb-4 space-y-3">
                {fp.rooms.slice(0, 3).map((r, rIdx) => (
                  <div
                    key={rIdx}
                    className="flex items-center justify-between gap-4 rounded-lg border border-[#3A1A22] bg-[#1F1216] p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={r.images?.[0] ?? fp.logo}
                        className="h-14 w-20 rounded object-cover border border-[#3A1A22]"
                      />

                      <div className="min-w-0">
                        <p className="text-[#F5DEB3] font-medium truncate">
                          {r.name}
                        </p>
                        <p className="text-xs text-[#F5DEB3]/60 truncate">
                          {data.checkInTime || "—"} • Free cancellation (if
                          available)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {typeof r.ratePerNight === "number" && (
                        <span className="font-semibold text-[#F5DEB3]">
                          ₹{r.ratePerNight.toLocaleString()}
                        </span>
                      )}

                      <a
                        href={r.link}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[#3A1A22] bg-[#241217] px-4 py-2 text-sm text-[#D4AF37] hover:border-[#D4AF37]"
                      >
                        Visit site
                      </a>
                    </div>
                  </div>
                ))}

                {fp.rooms.length > 3 && (
                  <div className="text-sm text-[#D4AF37] px-1">
                    + {fp.rooms.length - 3} more room rates
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 w-2/3 rounded bg-[#3A1A22]" />
      <div className="h-24 rounded bg-[#3A1A22]" />
      <div className="h-24 rounded bg-[#3A1A22]" />
    </div>
  );
}
