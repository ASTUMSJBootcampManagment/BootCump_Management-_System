import axios from "axios";

const url = "http://localhost:3000/api/progress";

export const getStudentsProgress = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${url}/get/students-progress`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProgress = async (studentId, status) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${url}/update-progress/${studentId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
