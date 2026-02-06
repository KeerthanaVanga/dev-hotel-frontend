import { Pencil } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
};

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-xl border border-[#3A1A22] bg-[#241217] p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium text-[#F5DEB3]">{user.name}</p>

        <button className="text-[#D4AF37] hover:underline">
          <Pencil size={16} />
        </button>
      </div>

      <p className="text-sm text-[#F5DEB3]/70">{user.email}</p>

      <p className="text-sm text-[#F5DEB3]/70">
        WhatsApp: {user.whatsappNumber}
      </p>
    </div>
  );
}
