import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ClipboardList,
  CalendarDays,
  ExternalLink,
  Send,
  X,
  RefreshCw,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

import API from "../../api/axios";
import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

export default function StudentAssignments() {
  const [assignments, setAssignments] =
    useState([]);

  const [submissions, setSubmissions] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        assignmentsResponse,
        submissionsResponse,
      ] = await Promise.all([
        API.get("/assignments"),
        API.get("/assignments/my-submissions"),
      ]);

      setAssignments(
        Array.isArray(
          assignmentsResponse.data
        )
          ? assignmentsResponse.data
          : assignmentsResponse.data?.data ||
              []
      );

      setSubmissions(
        Array.isArray(
          submissionsResponse.data
        )
          ? submissionsResponse.data
          : submissionsResponse.data?.data ||
              []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const getSubmission = (assignmentId) =>
    submissions.find(
      (submission) =>
        String(
          submission.assignment?._id ||
            submission.assignment
        ) === String(assignmentId)
    );

  const getStatus = (assignment) => {
    const submission = getSubmission(
      assignment._id
    );

    if (submission) {
      if (
        submission.grade !== null &&
        submission.grade !== undefined &&
        submission.grade !== ""
      ) {
        return "graded";
      }

      return "review";
    }

    if (
      assignment.dueDate &&
      new Date(assignment.dueDate) <
        new Date()
    ) {
      return "overdue";
    }

    return "pending";
  };

  const filteredAssignments = useMemo(() => {
    if (filter === "all") {
      return assignments;
    }

    return assignments.filter(
      (assignment) =>
        getStatus(assignment) === filter
    );
  }, [
    assignments,
    submissions,
    filter,
  ]);

  const openSubmission = (assignment) => {
    setSelected(assignment);
    setContent("");
    setMessage("");
  };

  const closeSubmission = () => {
    if (submitting) return;

    setSelected(null);
    setContent("");
  };

  const submit = async () => {
    if (!selected) return;

    if (!content.trim()) {
      setMessage(
        "Please add your submission before sending it."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      await API.post("/assignments/submit", {
        assignmentId: selected._id,
        content: content.trim(),
      });

      setMessage(
        "Assignment submitted successfully."
      );

      setSelected(null);
      setContent("");

      await loadAssignments();
    } catch (err) {
      console.error(err);

      setMessage(
        err.response?.data?.message ||
          "Unable to submit the assignment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StudentLayout title="My Assignments">
      <div className="student-page-head">
        <h2>My Assignments & Projects</h2>

        <p>
          View your tasks, submit your work, and
          review grades and mentor feedback.
        </p>
      </div>

      {error && (
        <div className="student-banner">
          {error}
        </div>
      )}

      {message && !selected && (
        <div className="student-banner">
          {message}
        </div>
      )}

      <div
        className="student-filter-row"
        style={{
          flexWrap: "wrap",
        }}
      >
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
        >
          All Tasks
        </FilterButton>

        <FilterButton
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pending Submission
        </FilterButton>

        <FilterButton
          active={filter === "review"}
          onClick={() => setFilter("review")}
        >
          Under Review
        </FilterButton>

        <FilterButton
          active={filter === "graded"}
          onClick={() => setFilter("graded")}
        >
          Graded
        </FilterButton>

        <button
          className="student-filter"
          onClick={loadAssignments}
        >
          <RefreshCw
            size={11}
            style={{
              verticalAlign: "middle",
              marginRight: 4,
            }}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="student-card student-empty">
          Loading assignments...
        </div>
      ) : (
        <>
          {filteredAssignments.map(
            (assignment) => {
              const submission =
                getSubmission(
                  assignment._id
                );

              const status =
                getStatus(assignment);

              return (
                <AssignmentCard
                  key={assignment._id}
                  assignment={assignment}
                  submission={submission}
                  status={status}
                  onSubmit={() =>
                    openSubmission(
                      assignment
                    )
                  }
                />
              );
            }
          )}

          {!filteredAssignments.length && (
            <div className="student-card student-empty">
              <ClipboardList
                size={22}
                style={{
                  marginBottom: 8,
                }}
              />

              <div>
                No assignments found in this
                category.
              </div>
            </div>
          )}
        </>
      )}

      {selected && (
        <div
          className="student-card student-panel"
          style={{
            marginTop: 14,
            borderColor: "#08bd8b",
          }}
        >
          <div className="student-panel-header">
            <div>
              <h3>
                Submit: {selected.title}
              </h3>

              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  color: "#8b97a5",
                  fontSize: 8,
                }}
              >
                Your submission will be sent to
                your mentor for review.
              </span>
            </div>

            <button
              className="student-filter"
              onClick={closeSubmission}
              disabled={submitting}
            >
              <X size={12} />
            </button>
          </div>

          {message && (
            <div className="student-banner">
              {message}
            </div>
          )}

          <div className="student-form">
            <label>
              Submission
              <textarea
                className="student-textarea"
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder={`Paste your GitHub repository, live demo URL, or explain where your submission can be reviewed.

Example:
GitHub: https://github.com/username/project
Live Demo: https://example.com

Notes:
I completed the authentication and dashboard features.`}
                disabled={submitting}
              />
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                className="student-filter"
                onClick={closeSubmission}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                className="student-btn"
                onClick={submit}
                disabled={submitting}
              >
                <Send
                  size={12}
                  style={{
                    verticalAlign: "middle",
                    marginRight: 5,
                  }}
                />

                {submitting
                  ? "Submitting..."
                  : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      className={`student-filter ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function AssignmentCard({
  assignment,
  submission,
  status,
  onSubmit,
}) {
  const statusInfo = {
    pending: {
      label: "Pending Submission",
      className: "pending",
      icon: <Clock3 size={11} />,
    },

    review: {
      label: "Under Review",
      className: "",
      icon: <Clock3 size={11} />,
    },

    graded: {
      label: "Graded",
      className: "",
      icon: <CheckCircle2 size={11} />,
    },

    overdue: {
      label: "Overdue",
      className: "absent",
      icon: <AlertCircle size={11} />,
    },
  }[status];

  return (
    <article className="student-card assignment">
      <div className="assignment-top">
        <div style={{ minWidth: 0 }}>
          <span className="assignment-tag">
            Bootcamp Assignment
          </span>

          <h3>{assignment.title}</h3>

          <p>
            {assignment.description ||
              "No assignment description provided."}
          </p>
        </div>

        <div
          style={{
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          <div className="assignment-due">
            <CalendarDays
              size={11}
              style={{
                verticalAlign: "middle",
                marginRight: 3,
              }}
            />

            {assignment.dueDate
              ? new Date(
                  assignment.dueDate
                ).toLocaleDateString()
              : "No due date"}
          </div>

          <span
            className={`student-status ${
              statusInfo.className
            }`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 7,
            }}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="assignment-footer">
        <div>
          {submission?.grade !==
          null &&
          submission?.grade !==
            undefined ? (
            <>
              <span className="student-status">
                Grade: {submission.grade}%
              </span>

              {submission.feedback && (
                <div
                  style={{
                    marginTop: 7,
                    fontSize: 8,
                    color: "#7f8b95",
                  }}
                >
                  <b>Mentor feedback:</b>{" "}
                  {submission.feedback}
                </div>
              )}
            </>
          ) : submission ? (
            <span
              style={{
                fontSize: 8,
                color: "#7f8b95",
              }}
            >
              Your submission is waiting for
              mentor review.
            </span>
          ) : (
            <span
              style={{
                fontSize: 8,
                color: "#7f8b95",
              }}
            >
              Submit your work before the due date.
            </span>
          )}
        </div>

        {!submission && (
          <button
            className="assignment-submit"
            onClick={onSubmit}
          >
            Submit Assignment
          </button>
        )}
      </div>
    </article>
  );
}