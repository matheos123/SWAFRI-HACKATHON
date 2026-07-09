import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rps-arena-2q2f.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // required for cookie-based auth
});

// Attach auth token to every request if present in localStorage
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("rps_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Surface backend error messages cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
    // Error shape: { message: { message: string, error: string, statusCode: number } }
    const message =
      body?.message?.message ||
      body?.message ||
      body?.error ||
      error.message ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
