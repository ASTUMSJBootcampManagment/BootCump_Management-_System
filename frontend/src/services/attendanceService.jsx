import axios from "axios";

const url = "http://localhost:3000/api/attendance";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getAttendance = async () => {
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

export const markAttendance = async (attendanceData) => {
  const response = await axios.post(
    `${url}/attender`,
    attendanceData,
    getAuthHeaders(),
  );
  return response.data;
};

export const getStudentAttendanceStats = async (studentId) => {
  const response = await axios.get(
    `${url}/stats/${studentId}`,
    getAuthHeaders(),
  );
  return response.data;
};
