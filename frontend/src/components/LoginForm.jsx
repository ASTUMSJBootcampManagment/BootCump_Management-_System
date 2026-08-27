import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import API from "../api/axios";
import Toast from "./common/Toast";

const LoginForm = () => {
  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type,
    });
  };

  const getErrorMessage = (error) => {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unable to complete login."
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/login",
        {
          email: data.email.trim(),
          password: data.password,
        }
      );

      const result = response.data;

      if (!result?.token || !result?.user) {
        throw new Error(
          "The server returned an invalid login response."
        );
      }

      // --------------------------------------------------
      // SAVE AUTH DATA
      // --------------------------------------------------

      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      localStorage.setItem(
        "requiresPasswordChange",
        String(
          Boolean(
            result.requiresPasswordChange ||
            result.user.mustChangePassword
          )
        )
      );

      // --------------------------------------------------
      // REMEMBER ME
      // --------------------------------------------------

      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }

      // --------------------------------------------------
      // PASSWORD CHANGE
      // --------------------------------------------------

      if (
        result.requiresPasswordChange ||
        result.user.mustChangePassword
      ) {
        showToast(
          "Login successful. Please change your temporary password.",
          "info"
        );

        setTimeout(() => {
          navigate("/change-password", {
            replace: true,
          });
        }, 500);

        return;
      }

      // --------------------------------------------------
      // ROLE REDIRECT
      // --------------------------------------------------

      showToast(
        result.message || "Login successful.",
        "success"
      );

      setTimeout(() => {
        switch (result.user.role) {
          case "Admin":
            navigate("/admin/dashboard", {
              replace: true,
            });
            break;

          case "Mentor":
            navigate("/mentor/dashboard", {
              replace: true,
            });
            break;

          case "Student":
            navigate("/student/dashboard", {
              replace: true,
            });
            break;

          default:
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            showToast(
              "Your account has an invalid role. Please contact the administrator.",
              "error"
            );
        }
      }, 500);
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      showToast(
        getErrorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast
        {...toast}
        onClose={() => setToast(null)}
      />

      <div className="flex min-h-screen flex-1 items-center justify-center bg-[#F7F4EA] px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-155">
          <div className="rounded-3xl bg-white px-6 py-8 shadow-[0_10px_50px_rgba(6,42,92,0.10)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F7F0]">
              <FiLock className="text-3xl text-[#0AA6A6]" />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold text-[#062A5C] sm:text-3xl">
                Welcome Back!
              </h2>

              <p className="mt-2 text-sm text-[#64748B] sm:text-base">
                Sign in to continue to your account
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 sm:mt-10 sm:space-y-6"
            >
              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#183153]"
                >
                  Email
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#94A3B8]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-4 text-[#183153] outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A] disabled:bg-slate-50 sm:py-4"
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#94A3B8]" />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={data.password}
                    onChange={(e) =>
                      setData({
                        ...data,
                        password:
                          e.target.value,
                      })
                    }
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-[#D9E2EC] py-3.5 pl-12 pr-12 text-[#183153] outline-none transition placeholder:text-[#94A3B8] focus:border-[#16B86A] focus:ring-4 focus:ring-[#16B86A] disabled:bg-slate-50 sm:py-4"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#94A3B8] hover:text-[#0AA6A6] disabled:opacity-50"
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </div>

              {/* OPTIONS */}

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#64748B]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(
                        e.target.checked
                      )
                    }
                    disabled={loading}
                    className="h-4 w-4 rounded border-gray-300 text-[#16B86A] focus:ring-[#16B86A]"
                  />

                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      "Password recovery is not available yet.",
                      "info"
                    )
                  }
                  className="text-sm font-medium text-[#0AA6A6] hover:text-[#16B86A]"
                >
                  Forgot password?
                </button>
              </div>

              {/* SIGN IN */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#16B86A] py-3.5 text-base font-semibold text-white shadow-lg shadow-[#16B86A]/20 transition hover:bg-[#12A85F] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-[#64748B]">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-[#0AA6A6] hover:text-[#16B86A]"
              >
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-[#94A3B8]">
            © 2026 ASTUMSJ Summer BootCamp. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;