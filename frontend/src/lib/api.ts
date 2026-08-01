// ============================================================
// MetricMind API Service
// ============================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ============================================================
// Helper - Get Access Token
// ============================================================

function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
}

// ============================================================
// Helper - Authenticated Headers
// ============================================================

function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

// ============================================================
// Helper - Handle API Response
// ============================================================

async function handleApiResponse(response: Response) {
  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    let errorMessage = "Something went wrong.";

    // FastAPI validation error
    if (Array.isArray(data?.detail)) {
      errorMessage = data.detail
        .map((error: any) => {
          if (typeof error === "string") {
            return error;
          }

          return error?.msg || "Invalid input";
        })
        .join(", ");
    }

    // FastAPI simple error
    else if (typeof data?.detail === "string") {
      errorMessage = data.detail;
    }

    // Custom backend message
    else if (typeof data?.message === "string") {
      errorMessage = data.message;
    }

    // Custom backend error
    else if (typeof data?.error === "string") {
      errorMessage = data.error;
    }

    throw new Error(errorMessage);
  }

  return data;
}

// ============================================================
// Authentication - Register
// ============================================================

export async function registerUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/register`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Register API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Authentication - Login
// ============================================================

export async function loginUser(data: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      }
    );

    const result =
      await handleApiResponse(response);

    // Save access token after successful login
    if (result?.access_token) {
      localStorage.setItem(
        "access_token",
        result.access_token
      );
    }

    return result;
  } catch (error) {
    console.error(
      "Login API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Authentication - Get Current User
// ============================================================

export async function getCurrentUser() {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error(
        "No authentication token found. Please login again."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/auth/me`,
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },

        cache: "no-store",
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Current User API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Authentication - Logout
// ============================================================

export function logoutUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
  }
}

// ============================================================
// Authentication - Check Login Status
// ============================================================

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const token =
    localStorage.getItem("access_token");

  return Boolean(token);
}

// ============================================================
// Dashboard
// ============================================================

export async function getDashboardSummary() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/summary`,
      {
        method: "GET",

        headers: getAuthHeaders(),

        cache: "no-store",
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Dashboard API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Analytics
// ============================================================

export async function getAnalyticsSummary() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/summary`,
      {
        method: "GET",

        headers: getAuthHeaders(),

        cache: "no-store",
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Analytics API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Upload Dataset
// ============================================================

export async function uploadDataset(
  file: File
) {
  try {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const token = getAccessToken();

    const headers: HeadersInit = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/upload`,
      {
        method: "POST",

        headers,

        body: formData,
      }
    );

    const data =
      await handleApiResponse(response);

    console.log(
      "Dataset uploaded successfully:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Upload API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Generate Chart
// ============================================================

export async function generateChart(
  chartRequest: {
    chart_type: string;
    x_column: string;
    y_column?: string;
  }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chart`,
      {
        method: "POST",

        headers: getAuthHeaders(),

        body: JSON.stringify(
          chartRequest
        ),
      }
    );

    const data =
      await handleApiResponse(response);

    console.log(
      "Chart generated successfully:",
      data
    );

    return data;
  } catch (error) {
    console.error(
      "Chart API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Generate AI Report
// ============================================================

export async function generateAIReport(
  request?: {
    report_focus?: string;
  }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ai/generate-report`,
      {
        method: "POST",

        headers: getAuthHeaders(),

        body: JSON.stringify(
          request || {}
        ),
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "AI Report API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Get All Reports
// ============================================================

export async function getReports() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports`,
      {
        method: "GET",

        headers: getAuthHeaders(),

        cache: "no-store",
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Reports API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Get Single Report
// ============================================================

export async function getReport(
  reportId: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/${encodeURIComponent(
        reportId
      )}`,
      {
        method: "GET",

        headers: getAuthHeaders(),

        cache: "no-store",
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Report API Error:",
      error
    );

    throw error;
  }
}

// ============================================================
// Chat
// ============================================================

export async function sendChatMessage(
  question: string
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/chat`,
      {
        method: "POST",

        headers: getAuthHeaders(),

        body: JSON.stringify({
          question,
        }),
      }
    );

    return await handleApiResponse(response);
  } catch (error) {
    console.error(
      "Chat API Error:",
      error
    );

    throw error;
  }
}