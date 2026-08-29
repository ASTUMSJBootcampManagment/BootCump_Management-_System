import {
  useEffect,
  useState,
} from "react";

import {
  BookOpen,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";

import API from "../../api/axios";

import StudentLayout from "../../components/student/StudentLayout";

import "../../components/student/student.css";

function iconFor(type) {
  const value =
    String(type || "")
      .toLowerCase();

  if (value.includes("video")) {
    return Video;
  }

  if (value.includes("link")) {
    return LinkIcon;
  }

  return FileText;
}

export default function StudentResources() {
  const [
    resources,
    setResources,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await API.get(
          "/student/resources"
        );

      setResources(
        response.data.data ||
          []
      );
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

  return (
    <StudentLayout title="Resources">
      <div className="
        student-page-head
      ">
        <div>
          {/* <h2>
            Learning Resources
          </h2> */}

          <p>
            Resources shared by your
            mentors and bootcamp
            administration.
          </p>
        </div>

        <button
          onClick={load}
          className="
            student-filter
          "
        >
          <RefreshCw
            size={14}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div className="
          student-banner
        ">
          {error}
        </div>
      )}

      {loading ? (
        <div className="
          student-card
          student-empty
        ">
          Loading resources...
        </div>
      ) : resources.length ===
        0 ? (
        <div className="
          student-card
          student-empty
        ">
          <BookOpen
            size={35}
            className="
              mx-auto
              mb-3
              text-[#08ad81]
            "
          />

          No learning resources have
          been shared yet.
        </div>
      ) : (
        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        ">
          {resources.map(
            (resource) => {
              const Icon =
                iconFor(
                  resource.type
                );

              return (
                <article
                  key={
                    resource._id
                  }
                  className="
                    student-card
                    student-panel
                    flex
                    flex-col
                  "
                >
                  <div className="
                    flex
                    items-start
                    gap-3
                  ">
                    <div className="
                      w-11
                      h-11
                      rounded-xl
                      bg-[#e8faf5]
                      text-[#08ad81]
                      grid
                      place-items-center
                    ">
                      <Icon size={20} />
                    </div>

                    <div className="
                      min-w-0
                    ">
                      <h3 className="
                        font-black
                        text-[#062a5c]
                      ">
                        {
                          resource.title
                        }
                      </h3>

                      <div className="
                        text-xs
                        text-slate-400
                        mt-1
                      ">
                        {resource.type ||
                          "Resource"}
                      </div>
                    </div>
                  </div>

                  {resource.description && (
                    <p className="
                      text-sm
                      text-slate-500
                      leading-6
                      mt-4
                    ">
                      {
                        resource.description
                      }
                    </p>
                  )}

                  {resource.batch?.name && (
                    <div className="
                      mt-4
                      text-xs
                      font-bold
                      text-slate-400
                    ">
                      Batch:{" "}
                      {
                        resource.batch
                          .name
                      }
                    </div>
                  )}

                  <a
                    href={
                      resource.url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-auto
                      pt-5
                    "
                  >
                    <span className="
                      student-btn
                      w-full
                    ">
                      <ExternalLink
                        size={14}
                      />
                      Open Resource
                    </span>
                  </a>
                </article>
              );
            }
          )}
        </div>
      )}
    </StudentLayout>
  );
}