import { useState } from "react";

export default function RoomGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <img src={active} className="h-105 w-full rounded-xl object-cover" />

      <div className="flex gap-3">
        {images.map((img) => (
          <button
            key={img}
            onClick={() => setActive(img)}
            className={`h-20 w-24 overflow-hidden rounded-lg border
              ${img === active ? "border-[#D4AF37]" : "border-[#3A1A22]"}
            `}
          >
            <img src={img} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
