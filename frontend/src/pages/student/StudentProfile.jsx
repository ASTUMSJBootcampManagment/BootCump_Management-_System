import { useEffect, useState } from "react";
import {
  User,
  Save,
  RefreshCw,
  Mail,
  Phone,
  GitBranch,
  Code2,
  MessageCircle,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentProfile() {
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    fullname: "",
    phoneNumber: "",
    githubAccount: "",
    leetcodeAccount: "",
    codeforcesAccount: "",
    telegramUsername: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/student/overview");
      
      const student =
        response.data?.data?.student ||
        response.data?.student ||
        response.data?.data ||
        response.data ||
        {};

      setUser(student);

      setForm({
        fullname: student.fullname || student.name || "",
        phoneNumber: student.phoneNumber || student.phone || "",
        githubAccount: student.githubAccount || student.github || "",
        leetcodeAccount: student.leetcodeAccount || student.leetcode || "",
        codeforcesAccount: student.codeforcesAccount || student.codeforces || "",
        telegramUsername: student.telegramUsername || student.telegram || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const change = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const save = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await API.patch("/student/profile", form);

      const updated =
        response.data?.data?.student ||
        response.data?.student ||
        response.data?.data ||
        response.data ||
        form;

      const mergedUser = { ...user, ...updated, ...form };
      setUser(mergedUser);

      const stored = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          fullname: mergedUser.fullname || stored.fullname,
          email: mergedUser.email || stored.email,
        })
      );

      setMessage("Profile updated successfully.");
      
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="My Profile">
        <div className="student-card student-empty">
          Loading your profile...
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Profile">
      {message && <div className="student-banner">{message}</div>}
      {error && <div className="student-banner">{error}</div>}

      <div className="grid xl:grid-cols-[.7fr_1.3fr] gap-5">
        <section className="student-card student-panel">
          <div className="flex flex-col items-center text-center py-5">
            <div className="w-24 h-24 rounded-3xl bg-[#e8faf5] text-[#08ad81] grid place-items-center text-4xl font-black">
              {(user.fullname || "S").charAt(0).toUpperCase()}
            </div>

            <h3 className="text-xl font-black text-[#062a5c] mt-4">
              {user.fullname || "Student"}
            </h3>

            <div className="text-sm text-slate-400 mt-1">Student</div>

            <div className="w-full mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Mail size={16} className="text-[#08ad81]" />
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-black text-slate-400">
                    Email
                  </div>
                  <div className="text-sm font-semibold truncate">
                    {user.email || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <User size={16} className="text-[#08ad81]" />
                <div>
                  <div className="text-[10px] uppercase font-black text-slate-400">
                    Role
                  </div>
                  <div className="text-sm font-semibold">Student</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={save} className="student-card student-panel">
          <div className="student-panel-header">
            <div>
              <h3>Personal information</h3>
              <span>
                Update the information you want the bootcamp team to have.
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-5">
            <div>
              <label className="student-label">Full name</label>
              <input
                className="student-input"
                value={form.fullname}
                onChange={(e) => change("fullname", e.target.value)}
              />
            </div>

            <div>
              <label className="student-label">Phone number</label>
              <div className="relative flex items-center">
                <Phone
                  size={16}
                  className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
                />
                <input
                  className="student-input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.phoneNumber}
                  onChange={(e) =>
                    change("phoneNumber", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="student-label">GitHub</label>
              <div className="relative flex items-center">
                <GitBranch
                  size={16}
                  className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
                />
                <input
                  className="student-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="GitHub username or URL"
                  value={form.githubAccount}
                  onChange={(e) =>
                    change("githubAccount", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="student-label">LeetCode</label>
              <div className="relative flex items-center">
                <Code2
                  size={16}
                  className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
                />
                <input
                  className="student-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="LeetCode username or URL"
                  value={form.leetcodeAccount}
                  onChange={(e) =>
                    change("leetcodeAccount", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="student-label">Codeforces</label>
              <div className="relative flex items-center">
                <Code2
                  size={16}
                  className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
                />
                <input
                  className="student-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="Codeforces username or URL"
                  value={form.codeforcesAccount}
                  onChange={(e) =>
                    change("codeforcesAccount", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="student-label">Telegram username</label>
              <div className="relative flex items-center">
                <MessageCircle
                  size={16}
                  className="absolute left-3.5 text-slate-400 pointer-events-none z-10"
                />
                <input
                  className="student-input"
                  style={{ paddingLeft: "2.5rem" }}
                  placeholder="@username"
                  value={form.telegramUsername}
                  onChange={(e) =>
                    change("telegramUsername", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              className="student-filter"
              onClick={load}
            >
              <RefreshCw size={13} />
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="student-btn"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </StudentLayout>
  );
}