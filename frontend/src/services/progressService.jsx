import axios from "axios";

export const getStudentsProgress = async () => {
  const token = localStorage.getItem("token");
  
  const response = await axios.get(
    "http://localhost:3000/api/progress/get/students-progress",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProgress = async (studentId, status, topic) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found in localStorage.");
  }

  if (!studentId) {
    throw new Error("Student ID is undefined or missing.");
  }

  const response = await axios.patch(
    `http://localhost:3000/api/progress/update-progress/${studentId}`,
    { status, topic },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
