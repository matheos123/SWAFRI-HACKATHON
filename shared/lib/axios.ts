import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://rps-arena-2q2f.onrender.com/api/v1"
      : "/api/v1", // proxied through Next.js in dev — same origin, cookies work
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
