import { useEffect, useState } from "react";
import {
  Megaphone,
  RefreshCw,
  CalendarDays,
  Pin,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(
        "/student/announcements"
      );

      setAnnouncements(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load announcements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <StudentLayout title="Announcements">
        <div className="student-card student-empty">
          Loading announcements...
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Announcements">
      {/* <div className="student-page-head">
        <h2>Announcements</h2>
        <p>
          Important updates from the bootcamp administration
          and mentors.
        </p>
      </div> */}

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          className="student-filter"
          onClick={load}
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <article
            key={announcement._id}
            className="student-card student-panel"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                <Megaphone size={21} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <h3 className="font-black text-[#062a5c] text-lg">
                      {announcement.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} />

                        {announcement.announcementDate
                          ? new Date(
                              announcement.announcementDate
                            ).toLocaleString()
                          : announcement.createdAt
                          ? new Date(
                              announcement.createdAt
                            ).toLocaleString()
                          : "Recently"}
                      </span>

                      {announcement.batch?.name && (
                        <span className="inline-flex items-center gap-1">
                          <Pin size={12} />
                          {announcement.batch.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="student-status">
                    Announcement
                  </span>
                </div>

                <div className="mt-5 text-sm text-slate-600 leading-7 whitespace-pre-wrap">
                  {announcement.content}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!announcements.length && (
        <div className="student-card student-empty">
          There are no announcements yet.
        </div>
      )}
    </StudentLayout>
  );
}