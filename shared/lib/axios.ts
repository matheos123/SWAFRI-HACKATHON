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
    let message = "Something went wrong";
    
    if (body) {
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message[0];
      } else if (body.message && typeof body.message === "object") {
        message = body.message.message || body.message.error || JSON.stringify(body.message);
      } else if (body.error && typeof body.error === "string") {
        message = body.error;
      } else if (body.error && typeof body.error === "object") {
        message = body.error.message || body.error.error || JSON.stringify(body.error);
      }
    } else if (error.message) {
      message = error.message;
    }
    
    return Promise.reject(new Error(message));
  },
);

export default apiClient;
