import { Lock, UserPlus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  changePassword,
  getAdmins,
  createAdminApi,
  updateAdminApi,
  deleteAdminApi,
  type AdminListItem,
} from "../api/auth.api";
import type { AdminFormPayload } from "../components/settings/AdminModal";
import AdminModal from "../components/settings/AdminModal";
import PasswordInput from "../components/ui/PasswordInput";
import { useToast } from "../context/ToastContext";

type AdminForEdit = { id: number; username: string; email: string };

/** API error response shape from backend */
interface ApiErrorResponse {
  message?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    const msg = axiosErr.response?.data?.message;
    if (typeof msg === "string") return msg;
  }
  return fallback;
}

export default function Settings() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminForEdit | null>(null);
  const [adminModalError, setAdminModalError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: adminsData, isLoading: adminsLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });
  const admins: AdminListItem[] = adminsData?.data?.admins ?? [];

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      showToast("success", "Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (err: unknown) => {
      showToast("error", getErrorMessage(err, "Failed to change password"));
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: createAdminApi,
    onSuccess: () => {
      showToast("success", "Admin added successfully");
      setAdminModalOpen(false);
      setEditingAdmin(null);
      setAdminModalError(null);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err: unknown) => {
      const msg = getErrorMessage(err, "Failed to add admin");
      setAdminModalError(msg);
      showToast("error", msg);
    },
  });

  const updateAdminMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminFormPayload }) =>
      updateAdminApi(id, {
        username: data.username,
        email: data.email,
        password: data.password || undefined,
      }),
    onSuccess: () => {
      showToast("success", "Admin updated successfully");
      setAdminModalOpen(false);
      setEditingAdmin(null);
      setAdminModalError(null);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err: unknown) => {
      const msg = getErrorMessage(err, "Failed to update admin");
      setAdminModalError(msg);
      showToast("error", msg);
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: deleteAdminApi,
    onSuccess: () => {
      showToast("success", "Admin removed successfully");
      setDeleteConfirmId(null);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (err: unknown) => {
      showToast("error", getErrorMessage(err, "Failed to delete admin"));
      setDeleteConfirmId(null);
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "New password and confirm password do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast("error", "New password must be at least 6 characters");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const openAddAdmin = () => {
    setEditingAdmin(null);
    setAdminModalError(null);
    setAdminModalOpen(true);
  };

  const openEditAdmin = (admin: AdminListItem) => {
    setEditingAdmin({
      id: admin.id,
      username: admin.username,
      email: admin.email,
    });
    setAdminModalError(null);
    setAdminModalOpen(true);
  };

  const handleAdminSubmit = (data: AdminFormPayload) => {
    setAdminModalError(null);
    if (editingAdmin) {
      updateAdminMutation.mutate({ id: editingAdmin.id, data });
    } else {
      createAdminMutation.mutate(data);
    }
  };

  const adminModalLoading =
    createAdminMutation.isPending || updateAdminMutation.isPending;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-10">
      <h1 className="text-2xl font-semibold text-[#D4AF37] tracking-wide">
        Settings
      </h1>

      {/* Change Password */}
      <section className="rounded-xl border border-[#3A1A22] bg-[#241217]/80 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3A1A22] bg-[#1B0F12]/50 flex items-center gap-2">
          <Lock className="text-[#D4AF37]" size={20} />
          <h2 className="text-lg font-medium text-[#F5DEB3]">
            Change Password
          </h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
          <div className="max-w-sm space-y-5">
            <PasswordInput
              label="Current password"
              value={passwordForm.currentPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, currentPassword: v }))
              }
              required
            />
            <PasswordInput
              label="New password"
              value={passwordForm.newPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, newPassword: v }))
              }
              required
              minLength={6}
            />
            <PasswordInput
              label="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(v) =>
                setPasswordForm((p) => ({ ...p, confirmPassword: v }))
              }
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633] disabled:opacity-60"
          >
            {changePasswordMutation.isPending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B0F12] border-t-transparent" />
            )}
            Update password
          </button>
        </form>
      </section>

      {/* Admin Users */}
      <section className="rounded-xl border border-[#3A1A22] bg-[#241217]/80 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-[#3A1A22] bg-[#1B0F12]/50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <UserPlus className="text-[#D4AF37]" size={20} />
            <h2 className="text-lg font-medium text-[#F5DEB3]">Admin users</h2>
          </div>
          <button
            onClick={openAddAdmin}
            className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#1B0F12] hover:bg-[#c9a633] flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add admin
          </button>
        </div>

        <div className="overflow-x-auto">
          {adminsLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded bg-[#3A1A22]" />
                ))}
              </div>
            </div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-[#F5DEB3]/60 text-sm">
              No admin users yet. Add one to get started.
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#3A1A22] text-left text-sm text-[#F5DEB3]/60">
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3A1A22]">
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="text-sm text-[#F5DEB3]/80 hover:bg-[#1B0F12]/30 transition"
                  >
                    <td className="px-6 py-4 font-medium text-[#F5DEB3]">
                      {admin.username}
                    </td>
                    <td className="px-6 py-4">{admin.email}</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditAdmin(admin)}
                        className="inline-flex items-center gap-1 text-[#D4AF37] hover:underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      {deleteConfirmId === admin.id ? (
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-[#F5DEB3]/70">
                            Remove?
                          </span>
                          <button
                            onClick={() => deleteAdminMutation.mutate(admin.id)}
                            disabled={deleteAdminMutation.isPending}
                            className="text-red-400 hover:underline text-sm"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-[#F5DEB3]/70 hover:underline text-sm"
                          >
                            No
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(admin.id)}
                          className="inline-flex items-center gap-1 text-red-400 hover:underline"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <AdminModal
        key={
          adminModalOpen
            ? editingAdmin
              ? `edit-${editingAdmin.id}`
              : "add"
            : "closed"
        }
        open={adminModalOpen}
        mode={editingAdmin ? "edit" : "add"}
        initialValues={
          editingAdmin
            ? { username: editingAdmin.username, email: editingAdmin.email }
            : undefined
        }
        isLoading={adminModalLoading}
        errorMessage={adminModalError}
        onClose={() => {
          if (!adminModalLoading) {
            setAdminModalOpen(false);
            setEditingAdmin(null);
            setAdminModalError(null);
          }
        }}
        onSubmit={handleAdminSubmit}
      />
    </div>
  );
}
