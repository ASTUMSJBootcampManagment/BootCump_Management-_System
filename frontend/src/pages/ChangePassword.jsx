import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (newPassword.length < 8) {
      setError(
        "Your new password must contain at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await API.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      localStorage.removeItem("requiresPasswordChange");

      setMessage(
        "Password changed successfully. Redirecting..."
      );

      setTimeout(() => {
        const user = JSON.parse(
          localStorage.getItem("user") || "{}"
        );

        if (user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (user.role === "Mentor") {
          navigate("/mentor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const PasswordInput = ({
    value,
    setValue,
    visible,
    setVisible,
    placeholder,
  }) => (
    <div className="relative">
      <LockKeyhole
        size={16}
        className="absolute left-3 top-3.5 text-slate-400"
      />

      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-xl py-3 pl-10 pr-11 outline-none focus:border-[#08c98b]"
      />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-3 text-slate-400"
      >
        {visible ? (
          <EyeOff size={17} />
        ) : (
          <Eye size={17} />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-[#062a5c] p-7 text-white">
          <div className="w-12 h-12 rounded-xl bg-[#08c98b] grid place-items-center mb-5">
            <LockKeyhole size={22} />
          </div>

          <h1 className="text-2xl font-black">
            Change your password
          </h1>

          <p className="text-sm text-white/60 mt-2 leading-6">
            Your account is using a temporary password.
            Create a new password before continuing.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="p-7 space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-3 text-sm font-semibold">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 text-sm font-semibold flex gap-2">
              <CheckCircle2 size={17} />
              {message}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-500 mb-2">
              CURRENT PASSWORD
            </label>

            <PasswordInput
              value={currentPassword}
              setValue={setCurrentPassword}
              visible={showCurrent}
              setVisible={setShowCurrent}
              placeholder="Temporary password"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 mb-2">
              NEW PASSWORD
            </label>

            <PasswordInput
              value={newPassword}
              setValue={setNewPassword}
              visible={showNew}
              setVisible={setShowNew}
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-500 mb-2">
              CONFIRM NEW PASSWORD
            </label>

            <PasswordInput
              value={confirmPassword}
              setValue={setConfirmPassword}
              visible={showConfirm}
              setVisible={setShowConfirm}
              placeholder="Repeat your password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#08c98b] hover:bg-[#07b67d] text-white rounded-xl py-3 font-black"
          >
            {loading
              ? "Changing password..."
              : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}