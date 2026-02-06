import { Pencil } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddUserModal from "../components/ui/AddUsersModel";
import { useToast } from "../context/ToastContext";
import Pagination from "../components/ui/Pagination";
import { getUsers, createUserApi, updateUserApi } from "../api/user.api";
import type { AddUserPayload } from "../components/ui/AddUsersModel";
import EmptyState from "../components/ui/EmptyState";
import UserCard from "../components/users/UserCard";

const PAGE_SIZE = 5;

type UIUser = {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
};

export default function Users() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  // edit state
  const [editingUser, setEditingUser] = useState<UIUser | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const { showToast } = useToast();
  const queryClient = useQueryClient();

  /* ---------- LIST USERS ---------- */
  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    select: (response) =>
      response.data.map((u: any) => ({
        id: String(u.user_id),
        name: u.name,
        email: u.email,
        whatsappNumber: u.whatsapp_number,
      })),
  });

  useEffect(() => {
    if (isError) {
      showToast("error", (error as Error)?.message || "Failed to load users");
    }
  }, [isError, error, showToast]);

  /* ---------- ADD USER MUTATION ---------- */
  const addUserMutation = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      showToast("success", "User added successfully");
      setModalOpen(false);
      setEditingUser(null);
      setModalError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      // keep modal open
      setModalError(err?.message || "Failed to add user");
    },
  });

  /* ---------- EDIT USER MUTATION ---------- */
  const editUserMutation = useMutation({
    mutationFn: (payload: { userId: string; data: AddUserPayload }) =>
      updateUserApi(payload.userId, payload.data),
    onSuccess: () => {
      showToast("success", "User updated successfully");
      setModalOpen(false);
      setEditingUser(null);
      setModalError(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      setModalError(err?.message || "Failed to update user");
    },
  });

  /* ---------- Modal open helpers ---------- */
  const openAddModal = () => {
    setEditingUser(null);
    setModalError(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UIUser) => {
    setEditingUser(user);
    setModalError(null);
    setModalOpen(true);
  };

  /* ---------- Modal submit ---------- */
  const handleSubmit = (data: AddUserPayload) => {
    setModalError(null);

    if (editingUser) {
      editUserMutation.mutate({ userId: editingUser.id, data });
    } else {
      addUserMutation.mutate(data);
    }
  };

  const totalPages = Math.ceil(users.length / PAGE_SIZE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, page]);

  const modalLoading = addUserMutation.isPending || editUserMutation.isPending;

  return (
    <div className="rounded-xl border border-[#3A1A22] bg-linear-to-b from-[#241217] to-[#1F1216] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-serif tracking-wide text-[#F5DEB3]">
            Users
          </h2>
          <p className="mt-1 text-sm text-[#F5DEB3]/60">
            Manage users, roles, and contact information.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633]"
        >
          Add user
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#3A1A22] text-left text-sm text-[#F5DEB3]/60">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">WhatsApp</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A1A22]">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="You haven’t added any users yet. Start by adding your first user to manage bookings and communication."
          actionLabel="Add user"
          onAction={openAddModal}
        />
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#3A1A22] text-left text-sm text-[#F5DEB3]/60">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">WhatsApp</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#3A1A22]">
                {paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="text-sm text-[#F5DEB3]/80 hover:bg-white/5 transition"
                  >
                    <td className="py-4 font-medium text-[#F5DEB3]">
                      {user.name}
                    </td>
                    <td className="py-4">{user.email}</td>
                    <td className="py-4">{user.whatsappNumber}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-4 md:hidden">
            {paginatedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      {/* Modal */}
      <AddUserModal
        open={modalOpen}
        mode={editingUser ? "edit" : "add"}
        initialValues={
          editingUser
            ? {
                name: editingUser.name,
                email: editingUser.email,
                whatsapp: editingUser.whatsappNumber,
              }
            : undefined
        }
        isLoading={modalLoading}
        errorMessage={modalError}
        onClose={() => {
          if (modalLoading) return;
          setModalOpen(false);
          setEditingUser(null);
          setModalError(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

/* Skeleton */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <td key={i} className="py-4">
          <div className="h-4 rounded bg-[#3A1A22]" />
        </td>
      ))}
    </tr>
  );
}
