import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { FormikProps } from "formik";
import type {
  CreateBookingFormValues,
  GuestType,
} from "../../types/CreateBookingForm";
import { AuthInput } from "../ui/AuthInput";
import { getUsers } from "../../api/user.api";
import type { ApiUser } from "../../api/user.api";
import { Search, UserPlus, User } from "lucide-react";

export type FormStepGuestDetailsProps = Pick<
  FormikProps<CreateBookingFormValues>,
  | "values"
  | "setFieldValue"
  | "setFieldTouched"
  | "setFieldError"
  | "errors"
  | "touched"
>;

const inputClass =
  "w-full rounded-md border border-[#3A1A22] bg-[#1F1216] px-3 py-2 text-[#F5DEB3] placeholder:text-[#F5DEB3]/50 focus:border-[#D4AF37] focus:outline-none";

const EMPTY_USERS: ApiUser[] = [];

function filterUsers(users: ApiUser[], search: string): ApiUser[] {
  const q = search.trim().toLowerCase();
  if (!q) return users;
  return users.filter(
    (u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      String(u.whatsapp_number || "").includes(q),
  );
}

export function FormStepGuestDetails({
  values,
  setFieldValue,
  setFieldTouched,
  setFieldError,
  errors,
  touched,
}: FormStepGuestDetailsProps) {
  const [userSearch, setUserSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
  const users = useMemo(
    () => usersData?.data ?? EMPTY_USERS,
    [usersData?.data],
  );

  const filteredUsers = useMemo(
    () => filterUsers(users, userSearch),
    [users, userSearch],
  );

  const selectedUser = useMemo(
    () => users.find((u) => String(u.user_id) === values.selected_user_id),
    [users, values.selected_user_id],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const setGuestType = (guest_type: GuestType) => {
    setFieldValue("guest_type", guest_type);
    if (guest_type === "new") {
      setFieldValue("selected_user_id", "");
      setUserSearch("");
      setFieldValue("guest_name", "");
      setFieldValue("guest_email", "");
      setFieldValue("whatsapp_number", "");
    } else {
      setUserSearch("");
    }
    setDropdownOpen(false);
  };

  const selectUser = (user: ApiUser) => {
    setFieldValue("selected_user_id", String(user.user_id));
    setFieldValue("guest_name", user.name ?? "");
    setFieldValue("guest_email", user.email ?? "");
    setFieldValue("whatsapp_number", user.whatsapp_number ?? "");
    // Clear any existing errors so prefilled values don't show stale "required" errors
    setFieldError("guest_name", undefined);
    setFieldError("guest_email", undefined);
    setFieldError("whatsapp_number", undefined);
    setUserSearch(user.name ?? "");
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* New vs Existing guest */}
      <div>
        <label className="block mb-2 text-sm text-[#F5DEB3]">
          Create booking for
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setGuestType("new")}
            className={`
              flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium
              transition-colors
              ${
                values.guest_type === "new"
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#F5DEB3]"
                  : "border-[#3A1A22] bg-[#1F1216] text-[#F5DEB3]/70 hover:border-[#F5DEB3]/40"
              }
            `}
          >
            <UserPlus size={18} />
            New guest
          </button>
          <button
            type="button"
            onClick={() => setGuestType("existing")}
            className={`
              flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium
              transition-colors
              ${
                values.guest_type === "existing"
                  ? "border-[#D4AF37] bg-[#D4AF37]/20 text-[#F5DEB3]"
                  : "border-[#3A1A22] bg-[#1F1216] text-[#F5DEB3]/70 hover:border-[#F5DEB3]/40"
              }
            `}
          >
            <User size={18} />
            Existing user
          </button>
        </div>
      </div>

      {/* Searchable user select (only when existing user) */}
      {values.guest_type === "existing" && (
        <div ref={dropdownRef} className="relative">
          <label className="block mb-1 text-sm text-[#F5DEB3]">
            Search and select user
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#F5DEB3]/50"
              aria-hidden
            />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Search by name, email or WhatsApp..."
              className={`${inputClass} pl-9`}
            />
          </div>
          {errors.selected_user_id && touched.selected_user_id && (
            <p className="mt-1 text-xs text-red-400">
              {errors.selected_user_id}
            </p>
          )}
          {dropdownOpen && (
            <ul
              className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md border border-[#3A1A22] bg-[#241217] py-1 shadow-lg"
              role="listbox"
            >
              {filteredUsers.length === 0 ? (
                <li className="px-3 py-2 text-sm text-[#F5DEB3]/60">
                  {users.length === 0
                    ? "No users found. Add users first."
                    : "No matching user. Try a different search."}
                </li>
              ) : (
                filteredUsers.map((user) => (
                  <li
                    key={user.user_id}
                    role="option"
                    aria-selected={
                      values.selected_user_id === String(user.user_id)
                    }
                    onClick={() => selectUser(user)}
                    className="cursor-pointer px-3 py-2.5 text-sm text-[#F5DEB3] hover:bg-white/10 focus:bg-white/10"
                  >
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-2 text-[#F5DEB3]/70">
                      {user.email}
                      {user.whatsapp_number ? ` · ${user.whatsapp_number}` : ""}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
          {selectedUser && !dropdownOpen && (
            <p className="mt-1 text-xs text-[#F5DEB3]/70">
              Selected: {selectedUser.name} ({selectedUser.email})
            </p>
          )}
        </div>
      )}

      {/* Guest details (prefilled when existing user selected) */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
        <AuthInput
          label="Guest name"
          type="text"
          name="guest_name"
          placeholder="Full name"
          value={values.guest_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("guest_name", e.target.value)
          }
          onBlur={() => setFieldTouched("guest_name", true)}
          error={errors.guest_name}
          touched={touched.guest_name}
        />

        <AuthInput
          label="Email (optional)"
          type="email"
          name="guest_email"
          placeholder="email@example.com"
          value={values.guest_email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("guest_email", e.target.value)
          }
          onBlur={() => setFieldTouched("guest_email", true)}
          error={errors.guest_email}
          touched={touched.guest_email}
        />

        <AuthInput
          label="WhatsApp number"
          type="tel"
          name="whatsapp_number"
          placeholder="e.g. 919876543210"
          value={values.whatsapp_number}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("whatsapp_number", e.target.value)
          }
          onBlur={() => setFieldTouched("whatsapp_number", true)}
          error={errors.whatsapp_number}
          touched={touched.whatsapp_number}
        />

        <AuthInput
          label="Adults"
          type="number"
          name="adults"
          min={1}
          value={values.adults}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("adults", e.target.value)
          }
          onBlur={() => setFieldTouched("adults", true)}
          error={errors.adults}
          touched={touched.adults}
        />

        <AuthInput
          label="Children (optional)"
          type="number"
          name="children"
          min={0}
          value={values.children}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFieldValue("children", e.target.value)
          }
          onBlur={() => setFieldTouched("children", true)}
          error={errors.children}
          touched={touched.children}
        />
      </div>
    </div>
  );
}
