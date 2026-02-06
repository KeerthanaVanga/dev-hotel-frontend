import { useState } from "react";
import { Mail, Lock, User, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { AuthInput } from "../components/ui/AuthInput";
import { AuthButton } from "../components/ui/AuthButton";
import { login, signup } from "../api/auth.api";

import HotelLogo from "../assets/ravila-logo.png";
type Mode = "signin" | "signup";

const AuthPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { refreshAuth, loading, setLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        return !value ? "Name is required" : "";
      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email";
        return "";
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Minimum 6 characters";
        return "";
      case "confirmPassword":
        if (!value) return "Confirm your password";
        if (value !== form.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));

    if (touched[field]) {
      setErrors((e) => ({
        ...e,
        [field]: validateField(field, value),
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({
      ...e,
      [field]: validateField(field, form[field as keyof typeof form]),
    }));
  };

  const isFormValid = () => {
    const required =
      mode === "signin"
        ? ["email", "password"]
        : ["name", "email", "password", "confirmPassword"];

    return required.every(
      (f) => !validateField(f, form[f as keyof typeof form])
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      showToast("error", "Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      if (mode === "signup") {
        await signup({
          username: form.name,
          email: form.email,
          password: form.password,
        });
        showToast("success", "Account created successfully");
      } else {
        await login({
          email: form.email,
          password: form.password,
        });
        showToast("success", "Signed in successfully");
      }

      await refreshAuth();
      navigate("/", { replace: true });
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-linear-to-br from-[#1B0F12] via-[#241217] to-[#1B0F12] overflow-hidden">
      {/* LEFT – HOTEL BRANDING */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#5A0F1B] px-12 text-[#D4AF37]">
        <img
          src={HotelLogo}
          alt="Redefining Hospitality"
          className="w-40 mb-8 drop-shadow-lg"
        />

        <h1 className="text-4xl font-serif tracking-widest">
          RAVILA GRAND HOTEL
        </h1>

        <p className="mt-3 text-sm tracking-[0.3em] uppercase text-[#F5DEB3]">
          Redefining Hospitality
        </p>

        <div className="mt-8 h-px w-32 bg-[#D4AF37]/70" />

        <p className="mt-8 max-w-md text-center text-sm text-[#F5DEB3]/90 leading-relaxed">
          Experience world-class luxury, refined elegance, and unmatched comfort
          crafted for unforgettable stays.
        </p>
      </div>

      {/* RIGHT – AUTH FORM */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-6 text-white">
          <h2 className="text-2xl font-serif tracking-wide text-[#D4AF37]">
            {mode === "signin"
              ? "Sign in to your account"
              : "Create an account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <AuthInput
                label="Name"
                icon={<User size={18} />}
                value={form.name}
                error={errors.name}
                touched={touched.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
            )}

            <AuthInput
              label="Email address"
              type="email"
              icon={<Mail size={18} />}
              value={form.email}
              error={errors.email}
              touched={touched.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
            />

            <AuthInput
              label="Password"
              type="password"
              icon={<Lock size={18} />}
              value={form.password}
              error={errors.password}
              touched={touched.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
            />

            {mode === "signup" && (
              <AuthInput
                label="Confirm Password"
                type="password"
                icon={<LockKeyhole size={18} />}
                value={form.confirmPassword}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
              />
            )}

            <AuthButton
              label={mode === "signin" ? "Sign in" : "Sign up"}
              loading={loading}
              disabled={!isFormValid() || loading}
            />
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-sm text-[#D4AF37] hover:underline"
          >
            {mode === "signin"
              ? "Create an account"
              : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
