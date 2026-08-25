import {
  BookOpen,
  ExternalLink,
  Code2,
  Database,
  GitBranch,
  Server,
  FileCode2,
  Globe2,
} from "lucide-react";

import StudentLayout from "../../components/student/StudentLayout";
import "../../components/student/student.css";

const resources = [
  {
    title: "React Documentation",
    description:
      "Official React documentation for components, hooks, state and modern React development.",
    icon: Code2,
    url: "https://react.dev/",
    category: "Frontend",
  },

  {
    title: "Node.js Documentation",
    description:
      "Learn the Node.js runtime, APIs and backend development concepts.",
    icon: Server,
    url: "https://nodejs.org/docs/latest/api/",
    category: "Backend",
  },

  {
    title: "Express.js Documentation",
    description:
      "Reference material for creating APIs and web applications with Express.",
    icon: Globe2,
    url: "https://expressjs.com/",
    category: "Backend",
  },

  {
    title: "MongoDB Documentation",
    description:
      "MongoDB database concepts, queries, aggregation and application development.",
    icon: Database,
    url: "https://www.mongodb.com/docs/",
    category: "Database",
  },

  {
    title: "Git Documentation",
    description:
      "Learn version control, branches, commits, merges and collaboration.",
    icon: GitBranch,
    url: "https://git-scm.com/doc",
    category: "Tools",
  },

  {
    title: "MDN Web Docs",
    description:
      "HTML, CSS and JavaScript references for web development.",
    icon: FileCode2,
    url: "https://developer.mozilla.org/",
    category: "Web",
  },
];

export default function StudentResources() {
  return (
    <StudentLayout title="Resources & Guides">
      <div className="student-page-head">
        <h2>Resources & Guides</h2>

        <p>
          Helpful documentation and references for
          your Full-Stack development journey.
        </p>
      </div>

      <div className="student-banner">
        <BookOpen
          size={14}
          style={{
            verticalAlign: "middle",
            marginRight: 6,
          }}
        />

        Use these official references while
        completing your bootcamp assignments and
        projects.
      </div>

      <div className="student-module-grid">
        {resources.map((resource) => {
          const Icon = resource.icon;

          return (
            <article
              className="student-card student-module"
              key={resource.title}
            >
              <div className="module-top">
                <span className="module-number">
                  {resource.category}
                </span>

                <span className="module-status">
                  Resource
                </span>
              </div>

              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 9,
                  background: "#e8faf5",
                  color: "#08ad81",
                  display: "grid",
                  placeItems: "center",
                  marginTop: 12,
                }}
              >
                <Icon size={18} />
              </div>

              <div className="module-title">
                {resource.title}
              </div>

              <div className="module-meta">
                {resource.description}
              </div>

              <a
                className="student-btn"
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 13,
                }}
              >
                Open Guide

                <ExternalLink size={10} />
              </a>
            </article>
          );
        })}
      </div>
    </StudentLayout>
  );
}