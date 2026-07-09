import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://rps-arena-2q2f.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // sends httpOnly cookies automatically on every request
});

// Surface backend error messages cleanly
// Error shape: { message: { message: string, error: string, statusCode: number } }
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const body = error.response?.data;
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
