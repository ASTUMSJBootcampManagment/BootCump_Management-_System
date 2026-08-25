import { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  CalendarDays,
  RefreshCw,
  Search,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/announcement/get"
      );

      setAnnouncements(
        response.data?.data || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const filtered = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return announcements;
    }

    return announcements.filter(
      (announcement) =>
        String(
          announcement.title || ""
        )
          .toLowerCase()
          .includes(query) ||
        String(
          announcement.content || ""
        )
          .toLowerCase()
          .includes(query)
    );
  }, [announcements, search]);

  return (
    <StudentLayout title="Announcements">
      <div className="student-page-head">
        <h2>Announcements & Notifications</h2>

        <p>
          Important updates, notices and messages
          from your bootcamp team.
        </p>
      </div>

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#fff",
            border: "1px solid #e3e8ed",
            borderRadius: 8,
            padding: "0 11px",
          }}
        >
          <Search
            size={14}
            color="#9aa5b1"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search announcements..."
            style={{
              width: "100%",
              border: 0,
              outline: 0,
              padding: "9px 0",
              fontSize: 9,
              color: "#26384a",
            }}
          />
        </div>

        <button
          className="student-filter"
          onClick={loadAnnouncements}
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {loading ? (
        <div className="student-card student-empty">
          Loading announcements...
        </div>
      ) : (
        <div className="student-list">
          {filtered.map((announcement) => (
            <article
              className="student-card student-panel"
              key={announcement._id}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: 9,
                    background: "#e8faf5",
                    color: "#08ad81",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Megaphone size={16} />
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="student-panel-header">
                    <h3>
                      {announcement.title}
                    </h3>

                    <span className="student-status">
                      Student
                    </span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: "#71808f",
                      fontSize: 9,
                      lineHeight: 1.7,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {announcement.content}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 10,
                      color: "#9aa5af",
                      fontSize: 7,
                    }}
                  >
                    <CalendarDays size={11} />

                    {announcement.announcementDate ||
                    announcement.createdAt
                      ? new Date(
                          announcement.announcementDate ||
                            announcement.createdAt
                        ).toLocaleString()
                      : "Recently published"}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {!filtered.length && (
            <div className="student-card student-empty">
              <Megaphone
                size={22}
                style={{
                  marginBottom: 8,
                }}
              />

              <div>
                {search
                  ? "No announcements match your search."
                  : "No announcements have been published yet."}
              </div>
            </div>
          )}
        </div>
      )}
    </StudentLayout>
  );
}