import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Room } from "../../types/Room";
import RoomFormSkeleton from "./skeletons/RoomFormSkeleton";
import { getRoomById, createRoom, updateRoom } from "../../api/rooms.api";

const EMPTY_ROOM: Room = {
  id: "",
  name: "",
  type: "",
  roomNumber: 0, // ✅ NEW
  totalRooms: 0,
  pricePerNight: 0,
  size: "",
  capacity: 1,
  images: [],
  description: "",
  amenities: [],
};

type InputProps = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
};

function Input({ label, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="block mb-1 text-[#F5DEB3]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none"
      />
    </div>
  );
}

type TextareaProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

function Textarea({ label, value, onChange }: TextareaProps) {
  return (
    <div>
      <label className="block mb-1 text-[#F5DEB3]">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-[#F5DEB3] focus:border-[#D4AF37] focus:outline-none"
      />
    </div>
  );
}

export default function RoomFormPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = Boolean(roomId);

  const [room, setRoom] = useState<Room>(EMPTY_ROOM);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  // For preview URLs of new files (so we can revoke later)
  const newImagePreviews = useMemo(
    () => newImages.map((f) => URL.createObjectURL(f)),
    [newImages],
  );

  // cleanup object urls
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newImagePreviews]);

  /* ---------------- Fetch room for edit ---------------- */
  const { data: apiRoom, isLoading: isFetchingRoom } = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => getRoomById(roomId!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (!apiRoom) return;

    setRoom({
      id: String(apiRoom.room_id),
      name: apiRoom.room_name,
      type: apiRoom.room_type,
      roomNumber: Number(apiRoom.room_number), // ✅ NEW
      totalRooms: Number(apiRoom.total_rooms),
      pricePerNight: Number(apiRoom.price),
      size: apiRoom.room_size,
      capacity: Number(apiRoom.guests),
      images: apiRoom.image_urls,
      description: apiRoom.description,
      amenities: apiRoom.amenities ?? [],
    });

    setExistingImages(apiRoom.image_urls ?? []);
    setNewImages([]);
  }, [apiRoom]);

  /* ---------------- Image handling ---------------- */
  const handleNewImages = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files);

    // optional: basic size/type checks
    setNewImages((prev) => [...prev, ...list]);
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- Mutations ---------------- */

  const buildFormData = () => {
    const form = new FormData();

    form.append("room_name", room.name);
    form.append("room_type", room.type);
    form.append("price", String(room.pricePerNight));
    form.append("room_size", room.size);
    form.append("guests", String(room.capacity));
    form.append("description", room.description);
    form.append("amenities", JSON.stringify(room.amenities));
    form.append("room_number", String(room.roomNumber));
    form.append("total_rooms", String(room.totalRooms));

    // Keep existing images (edit)
    form.append("existing_images", JSON.stringify(existingImages));

    // New images
    newImages.forEach((file) => form.append("images", file));

    return form;
  };

  const createMutation = useMutation({
    mutationFn: (payload: FormData) => createRoom(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate("/rooms");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: FormData) => updateRoom(roomId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", roomId] });
      navigate("/rooms");
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    const payload = buildFormData();
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  if (isEdit && isFetchingRoom) return <RoomFormSkeleton />;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-serif text-[#F5DEB3]">
        {isEdit ? "Edit Room" : "Add Room"}
      </h1>

      <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-6 space-y-6">
        {/* ---------------- Images ---------------- */}
        <div>
          <label className="block mb-2 text-[#F5DEB3]">Room Images</label>

          {/* Hidden input */}
          <input
            id="room-images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleNewImages(e.target.files)}
            className="hidden"
          />

          {/* Upload box (your design) */}
          <label
            htmlFor="room-images"
            className="
              flex cursor-pointer flex-col items-center justify-center
              rounded-xl border-2 border-dashed border-[#3A1A22]
              bg-[#1F1216] px-6 py-10
              text-center transition
              hover:border-[#D4AF37]
            "
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37]/15">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0l-3 3m3-3l3 3m7 4v8m0 0l-3-3m3 3l3-3"
                />
              </svg>
            </div>

            <p className="text-sm font-medium text-[#F5DEB3]">
              Click to upload room images
            </p>
            <p className="mt-1 text-xs text-[#F5DEB3]/60">
              PNG, JPG, JPEG • Multiple images allowed
            </p>
          </label>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <>
              <p className="mt-5 text-sm text-[#F5DEB3]/60">Existing Images</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div
                    key={img}
                    className="relative h-24 w-32 overflow-hidden rounded-lg"
                  >
                    <img
                      src={img}
                      className="h-full w-full object-cover"
                      alt="Existing room"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="
                        absolute right-1 top-1
                        rounded-full bg-black/60 px-2 py-1
                        text-xs text-white hover:bg-black
                      "
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <>
              <p className="mt-5 text-sm text-[#F5DEB3]/60">New Images</p>

              <div className="mt-3 flex flex-wrap gap-3">
                {newImages.map((file, i) => (
                  <div
                    key={`${file.name}-${i}`}
                    className="relative h-24 w-32 overflow-hidden rounded-lg"
                  >
                    <img
                      src={newImagePreviews[i]}
                      className="h-full w-full object-cover"
                      alt="New upload"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="
                        absolute right-1 top-1
                        rounded-full bg-black/60 px-2 py-1
                        text-xs text-white hover:bg-black
                      "
                      aria-label="Remove new image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ---------------- Fields ---------------- */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Room Number"
            type="number"
            value={room.roomNumber}
            onChange={(v: string) =>
              setRoom({ ...room, roomNumber: Number(v) })
            }
          />
          <Input
            label="Total Rooms"
            type="number"
            value={room.totalRooms}
            onChange={(v: string) =>
              setRoom({ ...room, totalRooms: Number(v) })
            }
          />
          <Input
            label="Room Name"
            value={room.name}
            onChange={(v: string) => setRoom({ ...room, name: v })}
          />
          <Input
            label="Room Type"
            value={room.type}
            onChange={(v: string) => setRoom({ ...room, type: v })}
          />
          <Input
            label="Price per Night"
            type="number"
            value={room.pricePerNight}
            onChange={(v: string) =>
              setRoom({ ...room, pricePerNight: Number(v) })
            }
          />
          <Input
            label="Room Size"
            value={room.size}
            onChange={(v: string) => setRoom({ ...room, size: v })}
          />
          <Input
            label="Capacity"
            type="number"
            value={room.capacity}
            onChange={(v: string) => setRoom({ ...room, capacity: Number(v) })}
          />
        </div>

        <Textarea
          label="Description"
          value={room.description}
          onChange={(v: string) => setRoom({ ...room, description: v })}
        />

        <Input
          label="Amenities (comma separated)"
          value={room.amenities.join(", ")}
          onChange={(v: string) =>
            setRoom({
              ...room,
              amenities: v
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            })
          }
        />

        {/* ---------------- Actions ---------------- */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="px-4 py-2 text-[#F5DEB3]/70 hover:text-[#F5DEB3]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="rounded-md bg-[#D4AF37] px-6 py-2 font-semibold text-[#1B0F12] hover:bg-[#c9a633] disabled:opacity-60"
          >
            {isSaving ? "Saving..." : isEdit ? "Update Room" : "Save Room"}
          </button>
        </div>

        {/* Optional: show mutation error */}
        {(createMutation.isError || updateMutation.isError) && (
          <p className="text-red-400 text-sm">
            {String(
              (createMutation.error as Error)?.message ||
                (updateMutation.error as Error)?.message ||
                "Failed to save room",
            )}
          </p>
        )}
      </div>
    </div>
  );
}
