import axios from "axios";

const API_URL = "http://localhost:3000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMentorDashboard = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/dashboard/mentor`,
      getAuthHeaders(),
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching mentor dashboard:",
      error.response?.data || error.message,
    );

    throw error;
  }
};
