import { redirect } from "react-router-dom";
import { getCurrentUser } from "../api/authApi";
import { isAxiosError, ErrorResponse } from "../utils/axiosUtils"; 

export async function requireAuthLoader() {
  try {
    const data: { user?: unknown } = await getCurrentUser();

    if (data.user) {
      return data.user;
    }


    if (window.location.pathname !== "/login") {
      return redirect("/login");
    }
  } catch (error: unknown) {
    if (isAxiosError<ErrorResponse>(error)) {
      console.error("Authentication error:", error.response?.data?.error || "Unauthorized access.");
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error.message);
    } else {
      console.error("Unknown error occurred.");
    }

    if (window.location.pathname !== "/login") {
      return redirect("/login");
    }
  }

  return null; 
}
