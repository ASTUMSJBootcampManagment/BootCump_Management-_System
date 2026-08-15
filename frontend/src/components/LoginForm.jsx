import { Link } from "react-router-dom";
import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-[#f5f7ff] px-5 py-10 sm:px-8 lg:px-12">
      <div className="w-full max-w-155">
        <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_10px_50px_rgba(30,64,175,0.08)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
            <FiLock className="text-3xl text-blue-600" />
          </div>

          <div className="mt-6 text-center">
            <h2 className="text-2xl font-bold text-[#14213d] sm:text-3xl">
              Welcome Back!
            </h2>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                Email
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:py-4"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-200 py-3.5 pl-12 pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:py-4"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            <button type="submit"
              className="w-full rounded-xl bg-[#4169e1] py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#3158d4] hover:shadow-xl sm:py-4"
            >
              Sign In
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          © 2026 ASTUMSJ Summer BootCamp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
