import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rps-arena-2q2f.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Surface backend error messages cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
    const message =
      body?.message?.message ||
      (Array.isArray(body?.message) ? body.message[0] : body?.message) ||
      body?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
