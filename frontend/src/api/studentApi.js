import API from "./axios";

export const studentApi = {
  overview: () => API.get("/student/overview"),

  attendance: () => API.get("/student/attendance"),

  progress: () => API.get("/student/progress"),

  assignments: () => API.get("/student/assignments"),

  submitAssignment: (payload) =>
    API.post("/student/assignments/submit", payload),

  announcements: () => API.get("/student/announcements"),

  updateProfile: (payload) =>
    API.patch("/student/profile", payload),
};