import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  CircleDashed,
  RefreshCw,
  TrendingUp,
  Target,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

const STATUS = {
  Completed: {
    icon: CheckCircle2,
    label: "Completed",
  },
  InProgress: {
    icon: Clock3,
    label: "In progress",
  },
  NeedsImprovement: {
    icon: AlertTriangle,
    label: "Needs improvement",
  },
  NotStarted: {
    icon: CircleDashed,
    label: "Not started",
  },
};

export default function StudentProgress() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/student/progress");
      setData(response.data?.data || null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your progress."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const topicsList = useMemo(() => {
    return data?.topics || [];
  }, [data]);

  const filteredTopics = useMemo(() => {
    if (filter === "all") return topicsList;
    return topicsList.filter((topic) => topic.status === filter);
  }, [topicsList, filter]);

  const inProgressCount = useMemo(() => {
    return topicsList.filter((x) => x.status === "InProgress").length;
  }, [topicsList]);

  if (loading) {
    return (
      <StudentLayout title="My Progress">
        <div className="student-card student-empty">
          Loading your learning progress...
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="My Progress">
      {/* <div className="student-page-head">
        <h2>Learning Progress</h2>
        <p>
          Follow your progress through the bootcamp curriculum.
          Your mentor updates these statuses.
        </p>
      </div> */}

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* Summary */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="student-card p-5">
              <div className="flex justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase">
                    Overall progress
                  </div>
                  <div className="text-3xl font-black text-[#062a5c] mt-2">
                    {data.percentage ?? 0}%
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Completed
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {data.completed ?? 0}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                of {data.total ?? 0} topics
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                In progress
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {inProgressCount}
              </div>
            </div>

            <div className="student-card p-5">
              <div className="text-xs font-bold text-slate-400 uppercase">
                Remaining
              </div>

              <div className="text-3xl font-black text-[#062a5c] mt-2">
                {Math.max((data.total ?? 0) - (data.completed ?? 0), 0)}
              </div>

              <div className="text-xs text-slate-400 mt-1">
                topics to complete
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <section className="student-card student-panel mt-5">
            <div className="student-panel-header">
              <div>
                <h3>Curriculum completion</h3>
                <span>
                  {data.completed ?? 0} of {data.total ?? 0} topics completed
                </span>
              </div>

              <button
                className="student-filter"
                onClick={load}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>

            <div className="h-4 bg-slate-100 rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-[#08c98b] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    Math.max(data.percentage ?? 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>0%</span>
              <span className="font-bold text-[#08ad81]">
                {data.percentage ?? 0}%
              </span>
              <span>100%</span>
            </div>
          </section>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              ["all", "All topics"],
              ["Completed", "Completed"],
              ["InProgress", "In progress"],
              ["NeedsImprovement", "Needs improvement"],
              ["NotStarted", "Not started"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`student-filter ${
                  filter === value ? "active" : ""
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Topics */}
          <div className="grid md:grid-cols-2 gap-4 mt-5">
            {filteredTopics.map((topic) => {
              const config =
                STATUS[topic.status] || STATUS.NotStarted;

              const Icon = config.icon;

              return (
                <article
                  key={topic._id || topic.topic}
                  className="student-card student-panel"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center">
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-[#062a5c]">
                            {topic.topic}
                          </h3>

                          {topic.module && (
                            <div className="text-xs text-slate-400 mt-1">
                              {topic.module}
                            </div>
                          )}
                        </div>

                        <span className="student-status">
                          {config.label}
                        </span>
                      </div>

                      {topic.notes && (
                        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-[10px] uppercase font-black text-slate-400 mb-1">
                            Mentor note
                          </div>

                          <p className="text-sm text-slate-600">
                            {topic.notes}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                        <Target size={13} />
                        Updated{" "}
                        {topic.updatedAt
                          ? new Date(
                              topic.updatedAt
                            ).toLocaleDateString()
                          : "recently"}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {!filteredTopics.length && (
            <div className="student-card student-empty mt-5">
              No topics match this filter.
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
}