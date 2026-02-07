import { useQuery } from "@tanstack/react-query";
import { User, Mail, AtSign, Calendar, RefreshCw } from "lucide-react";
import { getProfile, type AdminProfile } from "../api/auth.api";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function Profile() {
  const { showToast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfile();
      return res.data.profile as AdminProfile;
    },
  });

  useEffect(() => {
    if (isError) {
      showToast("error", (error as Error)?.message ?? "Failed to load profile");
    }
  }, [isError, error, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-24 w-24 rounded-full bg-[#3A1A22]" />
          <div className="h-6 w-48 bg-[#3A1A22] rounded" />
          <div className="h-4 w-32 bg-[#3A1A22]/60 rounded" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#F5DEB3]/70">Unable to load profile.</p>
      </div>
    );
  }

  const fields = [
    { label: "Username", value: data.username, icon: User },
    { label: "Email", value: data.email, icon: Mail },
    { label: "Account ID", value: String(data.id), icon: AtSign },
    {
      label: "Member since",
      value: formatDate(data.createdAt),
      icon: Calendar,
    },
    {
      label: "Last updated",
      value: formatDate(data.updatedAt),
      icon: RefreshCw,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-[#D4AF37] tracking-wide mb-6">
        Profile
      </h1>

      <div className="rounded-xl border border-[#3A1A22] bg-[#241217]/80 shadow-lg overflow-hidden">
        <div className="px-6 py-8 border-b border-[#3A1A22] bg-[#1B0F12]/50">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-[#D4AF37]/20 border-2 border-[#D4AF37] flex items-center justify-center shrink-0">
              <User className="text-[#D4AF37]" size={36} />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl font-medium text-[#F5DEB3]">
                {data.username}
              </p>
              <p className="text-sm text-[#F5DEB3]/70">{data.email}</p>
            </div>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2">
          {fields.map(({ label, value, icon: Icon }, index) => (
            <li
              key={label}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-[#1B0F12]/30 transition border-[#3A1A22] border-b last:border-b-0 ${index % 2 === 0 ? "sm:border-r" : ""}`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3A1A22] text-[#D4AF37]">
                <Icon size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-[#F5DEB3]/60">
                  {label}
                </p>
                <p className="text-[#F5DEB3] truncate">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
