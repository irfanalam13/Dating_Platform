"use client";

import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { showError } from "@/shared/utils/toast";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const { mutate, isPending } = useRegister();
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const password = form.password.trim();
  const confirm_password = form.confirm_password.trim();

  const isLengthValid = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[A-Za-z]/.test(password);

  const passwordsMatch =
    password && confirm_password && password === confirm_password;

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!form.full_name || !form.username || !form.email) {
      return showError("All fields are required");
    }

    if (!isLengthValid) {
      return showError("Password must be at least 6 characters");
    }

    if (!passwordsMatch) {
      return showError("Passwords do not match");
    }

    mutate({
      full_name: form.full_name,
      username: form.username,
      email: form.email,
      password: password,
      confirm_password: confirm_password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-400 px-4">
      
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl space-y-5 text-white"
      >
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create Account 🚀</h2>
          <p className="text-white/70 text-sm">
            Start your journey today
          </p>
        </div>

        {/* Inputs */}
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
        />

        {/* Password */}
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-3 text-white/60"
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Password Strength */}
        {password && (
          <div className="text-sm space-y-1 text-white/80">
            <div className="flex items-center gap-2">
              {isLengthValid ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <span>At least 6 characters</span>
            </div>

            <div className="flex items-center gap-2">
              {hasLetter ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <span>Contains letters</span>
            </div>

            <div className="flex items-center gap-2">
              {hasNumber ? (
                <CheckCircle className="text-green-400" size={16} />
              ) : (
                <XCircle className="text-red-400" size={16} />
              )}
              <span>Contains number</span>
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <input
            name="confirm_password"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-white focus:ring-2 focus:ring-white/40 transition"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-white/60"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Match indicator */}
        {form.confirm_password && (
          <div className="flex items-center gap-2 text-sm">
            {passwordsMatch ? (
              <>
                <CheckCircle className="text-green-400" size={16} />
                <span className="text-green-400">Passwords match</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-400" size={16} />
                <span className="text-red-400">Passwords do not match</span>
              </>
            )}
          </div>
        )}

        {/* Button */}
        <button
          disabled={isPending}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          {isPending ? "Creating..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-white/70">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-white font-semibold underline"
          >
            Login
          </button>
        </p>
      </motion.form>
    </div>
  );
}