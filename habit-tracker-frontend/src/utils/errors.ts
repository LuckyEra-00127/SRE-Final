import axios from "axios";

interface FastApiValidationError {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

export function getFriendlyError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "The server is unreachable. Check that the backend is running and try again.";
    }

    const detail = error.response.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item: FastApiValidationError) => item.msg)
        .filter(Boolean)
        .join(". ");
    }

    if (error.response.status >= 500) {
      return "Something went wrong on the server. Please try again shortly.";
    }

    return "The request could not be completed. Please review your input and try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
