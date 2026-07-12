import axios from "axios";

const remoteApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://rps-arena-2q2f.onrender.com/api/v1";

const apiClient = axios.create({
  // Browser requests stay same-origin and are proxied by the Next.js rewrite.
  // Server-side callers can still reach the backend directly.
  baseURL: typeof window === "undefined" ? remoteApiUrl : "/backend-api",
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
