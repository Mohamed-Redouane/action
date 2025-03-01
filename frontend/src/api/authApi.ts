import axios from "axios";
import { AxiosError } from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (
      error.response?.status === 401 &&
      !(error.config.url && error.config.url.includes("/api/auth/me"))
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface ErrorResponse {
  error?: string;
}

function isAxiosError<T = unknown>(error: unknown): error is AxiosError<T> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}
function extractErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<ErrorResponse>(error) && error.response) {
    return error.response.data?.error ?? fallback;
  }
  return fallback;
}

export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await api.post("/api/auth/register", { username, email, password });
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Registration failed.");
    throw new Error(message);
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data; 
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Login failed.");
    throw new Error(message);
  }
}

export async function logoutUser() {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data; 
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Logout failed.");
    throw new Error(message);
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const response = await api.post("/api/auth/request-password-reset", { email });
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Failed to request password reset.");
    throw new Error(message);
  }
}

export async function resetPassword(code: string, newPassword: string) {
  try {
    const response = await api.post("/api/auth/reset-password", { code, newPassword });
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Failed to reset password.");
    throw new Error(message);
  }
}

export async function verifyEmail(userId: number, code: string) {
  try {
    const response = await api.post("/api/auth/verify-email", { userId, code });
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Email verification failed.");
    throw new Error(message);
  }
}

export async function resendVerification(userId: number) {
  try {
    const response = await api.post("/api/auth/resend-verification", { userId });
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Failed to resend verification email.");
    throw new Error(message);
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/api/auth/me");
    return response.data;
  } catch (error: unknown) {
    const message = extractErrorMessage(error, "Failed to fetch current user.");
    throw new Error(message);
  }
}

export { api };
