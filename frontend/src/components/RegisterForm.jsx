import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    universityId: "",
    codeforcesAccount: "",
    leetcodeAccount: "",
    githubAccount: "",
    reasonToJoin: "",
    telegramUsername: "",
    phoneNumber: "",
    gender: "",
    hasConstantInternet: false,
    hasPersonalLaptop: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData,
      );

      console.log("Registration response:", response.data);

      setSuccess(
        response.data?.message ||
          "Registration successful. Please wait for approval.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Status:", err?.response?.status);
      console.error("Server response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          "Registration failed. Please check your information.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* ==============================
            HEADER
        =============================== */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            ASTU MSJ Summer Bootcamp
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Create your account to join the bootcamp
          </p>
        </div>

        {/* ==============================
            FORM CARD
        =============================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* ==========================
                MESSAGES
            =========================== */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            {/* ==========================
                BASIC INFORMATION
            =========================== */}

            <div className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Basic Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* University ID */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    University ID
                  </label>

                  <input
                    type="text"
                    name="universityId"
                    value={formData.universityId}
                    onChange={handleChange}
                    placeholder="Enter university ID"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* Phone */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="09xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* Gender */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Telegram */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Telegram Username
                  </label>

                  <input
                    type="text"
                    name="telegramUsername"
                    value={formData.telegramUsername}
                    onChange={handleChange}
                    placeholder="@username"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>
              </div>
            </div>

            {/* ==========================
                PROGRAMMING ACCOUNTS
            =========================== */}

            <div className="mb-8">
              <h2 className="mb-1 text-lg font-bold text-slate-900">
                Programming Accounts
              </h2>

              <p className="mb-4 text-sm text-slate-500">
                Add your coding platform accounts.
              </p>

              <div className="grid gap-5 sm:grid-cols-3">
                {/* Codeforces */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Codeforces
                  </label>

                  <input
                    type="text"
                    name="codeforcesAccount"
                    value={formData.codeforcesAccount}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* LeetCode */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    LeetCode
                  </label>

                  <input
                    type="text"
                    name="leetcodeAccount"
                    value={formData.leetcodeAccount}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>

                {/* GitHub */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    GitHub
                  </label>

                  <input
                    type="text"
                    name="githubAccount"
                    value={formData.githubAccount}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
                  />
                </div>
              </div>
            </div>

            {/* ==========================
                ABOUT YOU
            =========================== */}

            <div className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                About You
              </h2>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Why do you want to join the bootcamp?
              </label>

              <textarea
                name="reasonToJoin"
                value={formData.reasonToJoin}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us why you want to join..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#00C896] focus:ring-2 focus:ring-[#00C896]/20"
              />
            </div>

            {/* ==========================
                REQUIREMENTS
            =========================== */}

            <div className="mb-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                Requirements
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Internet */}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="hasConstantInternet"
                    checked={formData.hasConstantInternet}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-[#00C896] focus:ring-[#00C896]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Constant Internet
                    </p>

                    <p className="text-xs text-slate-400">
                      I have reliable internet access.
                    </p>
                  </div>
                </label>

                {/* Laptop */}

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    name="hasPersonalLaptop"
                    checked={formData.hasPersonalLaptop}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-slate-300 text-[#00C896] focus:ring-[#00C896]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Personal Laptop
                    </p>

                    <p className="text-xs text-slate-400">
                      I have access to a personal laptop.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ==========================
                SUBMIT
            =========================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-[#00C896]
                px-5
                py-3.5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[#00b386]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* LOGIN */}

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#00C896] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
