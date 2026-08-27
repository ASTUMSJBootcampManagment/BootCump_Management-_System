import { useEffect, useState } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

function getResourceIcon(resource) {
  const type = String(
    resource.type || resource.resourceType || ""
  ).toLowerCase();

  if (type.includes("video")) return Video;

  if (
    type.includes("link") ||
    type.includes("url")
  ) {
    return LinkIcon;
  }

  return FileText;
}

export default function StudentResources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get(
        "/student/resources"
      );

      setResources(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load resources."
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
      <StudentLayout title="Resources">
        <div className="student-card student-empty">
          Loading resources...
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Resources">
      <div className="student-page-head">
        <h2>Learning Resources</h2>
        <p>
          Materials shared by your mentors and bootcamp
          administration.
        </p>
      </div>

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

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {resources.map((resource) => {
          const Icon = getResourceIcon(resource);

          const url =
            resource.url ||
            resource.link ||
            resource.fileUrl ||
            resource.file;

          return (
            <article
              key={resource._id}
              className="student-card student-panel flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#e8faf5] text-[#08ad81] grid place-items-center shrink-0">
                  <Icon size={20} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-[#062a5c]">
                    {resource.title ||
                      resource.name ||
                      "Learning resource"}
                  </h3>

                  {resource.category && (
                    <div className="text-xs text-slate-400 mt-1">
                      {resource.category}
                    </div>
                  )}
                </div>
              </div>

              {(resource.description ||
                resource.content) && (
                <p className="text-sm text-slate-500 mt-4 leading-6">
                  {resource.description ||
                    resource.content}
                </p>
              )}

              <div className="mt-auto pt-5">
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="student-btn w-full"
                  >
                    {resource.fileUrl ||
                    resource.file ? (
                      <>
                        <Download size={14} />
                        Open resource
                      </>
                    ) : (
                      <>
                        <ExternalLink size={14} />
                        Open link
                      </>
                    )}
                  </a>
                ) : (
                  <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
                    This resource does not currently have an
                    external link.
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {!resources.length && (
        <div className="student-card student-empty">
          No resources have been shared yet.
        </div>
      )}
    </StudentLayout>
  );
}