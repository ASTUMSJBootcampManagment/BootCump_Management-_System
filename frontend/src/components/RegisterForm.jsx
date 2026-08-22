import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Account created successfully");
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F4EA] px-5 py-10 sm:px-8 lg:px-12">

      <div className="w-full max-w-155">

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7F0]">
            <FiUser className="text-3xl text-[#0AA6A6]" />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#062A5C]">
            Create Your Account
          </h1>

          <p className="mt-2 text-[#64748B]">
            Join the ASTUMSJ Summer BootCamp
          </p>

        </div>

        <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_10px_50px_rgba(6,42,92,0.10)] sm:px-10 sm:py-10">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-[#183153]"
              >
                Full Name
              </label>

              <div className="relative">

                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-4 outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A]/10"
                />

              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#183153]"
              >
                Email
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-4 outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A]/10"
                />

              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#183153]"
              >
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                /><input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-12 outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8] transition hover:text-[#0AA6A6]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>

              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#183153]"
              >
                Confirm Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-12 outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8] transition hover:text-[#0AA6A6]"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#16B86A] py-4 text-base font-semibold text-white shadow-lg shadow-[#16B86A]/20 transition hover:bg-[#12A85F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-[#64748B]">
            Already have an account?{" "}

            <button
              type="button"
              className="font-semibold text-[#0AA6A6] transition hover:text-[#16B86A]"
            >
              Sign in
            </button>
          </p>

        </div>

        <p className="mt-6 text-center text-sm text-[#94A3B8]">
          © 2026 ASTUMSJ Summer BootCamp. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Register;