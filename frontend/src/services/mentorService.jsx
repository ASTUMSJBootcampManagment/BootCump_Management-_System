import API from "../api/axios";

export const getAssignments = () => API.get("/assignments");
export const createAssignment = (data) => API.post("/assignments", data);
export const updateAssignment = (id, data) => API.put(`/assignments/${id}`, data);
export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);
export const getSubmissions = (assignmentId) => API.get(`/assignments/${assignmentId}/submissions`);
export const gradeSubmission = (id, data) => API.put(`/grading/${id}`, data);

export const getAnnouncements = () => API.get("/announcement/get");
export const createAnnouncement = (data) => API.post("/announcement/create", data);
export const updateAnnouncement = (id, data) => API.put(`/announcement/${id}`, data);
export const deleteAnnouncement = (id) => API.delete(`/announcement/${id}`);
