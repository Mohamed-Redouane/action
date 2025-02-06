import axios from "axios";

// Create a reusable API instance with default configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Register a new user
 */
export async function registerUser(username: string, email: string, password: string) {
  try {
    const response = await api.post("/api/auth/register", { username, email, password });
    return response.data; // { message, user }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Registration failed.");
  }
}

/**
 * Log in an existing user
 */
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data; // { message, user }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Login failed.");
  }
}

/**
 * Log out the current user (invalidates session cookie on the server)
 */
export async function logoutUser() {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data; // { message: "Logged out" }
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Logout failed.");
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string) {
  try {
    const response = await api.post("/api/auth/request-password-reset", { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to request password reset.");
  }
}

/**
 * Reset password using the given code
 */
export async function resetPassword(code: string, newPassword: string) {
  try {
    const response = await api.post("/api/auth/reset-password", { code, newPassword });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to reset password.");
  }
}

/**
 * Verify user email with a code
 */
export async function verifyEmail(userId: number, code: string) {
  try {
    const response = await api.post("/api/auth/verify-email", { userId, code });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Email verification failed.");
  }
}

/**
 * Resend a verification email
 */
export async function resendVerification(userId: number) {
  try {
    const response = await api.post("/api/auth/resend-verification", { userId });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to resend verification email.");
  }
}
