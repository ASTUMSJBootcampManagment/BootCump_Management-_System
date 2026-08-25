import { useEffect, useState } from "react";

import {
  UserRound,
  Save,
  Code2,
  Trophy,
  ShieldCheck,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem("user") || "null"
    );
  } catch {
    return null;
  }
}

export default function StudentProfile() {
  const [user, setUser] = useState(
    getStoredUser()
  );

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    githubAccount: "",
    leetcodeAccount: "",
    codeforcesAccount: "",
    telegramUsername: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredUser();

    if (!stored) return;

    setForm({
      fullname:
        stored.fullname ||
        stored.name ||
        "",

      email: stored.email || "",

      phoneNumber:
        stored.phoneNumber || "",

      githubAccount:
        stored.githubAccount || "",

      leetcodeAccount:
        stored.leetcodeAccount || "",

      codeforcesAccount:
        stored.codeforcesAccount || "",

      telegramUsername:
        stored.telegramUsername || "",
    });
  }, []);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await API.patch(
        "/student/profile",
        {
          fullname: form.fullname,
          phoneNumber: form.phoneNumber,
          githubAccount:
            form.githubAccount,
          leetcodeAccount:
            form.leetcodeAccount,
          codeforcesAccount:
            form.codeforcesAccount,
          telegramUsername:
            form.telegramUsername,
        }
      );

      const updated =
        response.data?.data;

      if (updated) {
        localStorage.setItem(
          "user",
          JSON.stringify(updated)
        );

        setUser(updated);

        window.dispatchEvent(
          new Event(
            "student-user-updated"
          )
        );
      }

      setMessage(
        "Your profile was updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const name =
    user?.fullname ||
    user?.name ||
    form.fullname ||
    "Student";

  return (
    <StudentLayout title="My Profile & Badges">
      <div className="student-page-head">
        <h2>My Profile & Achievements</h2>

        <p>
          Manage your student information and view
          your bootcamp achievements.
        </p>
      </div>

      {message && (
        <div className="student-banner">
          {message}
        </div>
      )}

      {error && (
        <div
          className="student-banner"
          style={{
            background: "#fff0f0",
            borderColor: "#ffd5d5",
            color: "#a33d3d",
          }}
        >
          {error}
        </div>
      )}

      <div className="student-two-col">
        <section className="student-card student-panel">
          <div className="student-panel-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "#e8faf5",
                  color: "#08ad81",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <UserRound size={18} />
              </div>

              <div>
                <h3>Profile Information</h3>

                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    color: "#8b97a5",
                    fontSize: 7,
                  }}
                >
                  {name}
                </span>
              </div>
            </div>
          </div>

          <form
            className="student-form"
            onSubmit={saveProfile}
          >
            <label>
              Full Name

              <input
                className="student-input"
                value={form.fullname}
                onChange={(event) =>
                  updateField(
                    "fullname",
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label>
              Email

              <input
                className="student-input"
                type="email"
                value={form.email}
                readOnly
              />
            </label>

            <label>
              Phone Number

              <input
                className="student-input"
                value={form.phoneNumber}
                onChange={(event) =>
                  updateField(
                    "phoneNumber",
                    event.target.value
                  )
                }
                placeholder="+251..."
              />
            </label>

            <label>
              GitHub

              <input
                className="student-input"
                value={form.githubAccount}
                onChange={(event) =>
                  updateField(
                    "githubAccount",
                    event.target.value
                  )
                }
                placeholder="https://github.com/username"
              />
            </label>

            <label>
              LeetCode

              <input
                className="student-input"
                value={form.leetcodeAccount}
                onChange={(event) =>
                  updateField(
                    "leetcodeAccount",
                    event.target.value
                  )
                }
                placeholder="https://leetcode.com/username"
              />
            </label>

            <label>
              Codeforces

              <input
                className="student-input"
                value={form.codeforcesAccount}
                onChange={(event) =>
                  updateField(
                    "codeforcesAccount",
                    event.target.value
                  )
                }
                placeholder="https://codeforces.com/profile/username"
              />
            </label>

            <label>
              Telegram Username

              <input
                className="student-input"
                value={form.telegramUsername}
                onChange={(event) =>
                  updateField(
                    "telegramUsername",
                    event.target.value
                  )
                }
                placeholder="@username"
              />
            </label>

            <button
              type="submit"
              className="student-btn"
              disabled={saving}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Save size={12} />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </form>
        </section>

        <section className="student-card student-panel">
          <div className="student-panel-header">
            <h3>My Badges</h3>
          </div>

          <div className="student-list">
            <Badge
              icon={<UserRound size={16} />}
              title="Bootcamp Explorer"
              description="Joined the summer bootcamp"
              status="Earned"
            />

            <Badge
              icon={<ShieldCheck size={16} />}
              title="Attendance Champion"
              description="Maintain excellent attendance"
              status="In progress"
            />

            <Badge
              icon={<Code2 size={16} />}
              title="MERN Builder"
              description="Complete the core MERN modules"
              status="In progress"
            />

            <Badge
              icon={<Trophy size={16} />}
              title="Project Finisher"
              description="Complete the final project"
              status="Locked"
              pending
            />
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}

function Badge({
  icon,
  title,
  description,
  status,
  pending = false,
}) {
  return (
    <div className="student-list-item">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#e8faf5",
            color: "#08ad81",
            display: "grid",
            placeItems: "center",
          }}
        >
          {icon}
        </div>

        <div>
          <strong>{title}</strong>

          <span>{description}</span>
        </div>
      </div>

      <span
        className={`student-status ${
          pending ? "pending" : ""
        }`}
      >
        {status}
      </span>
    </div>
  );
}