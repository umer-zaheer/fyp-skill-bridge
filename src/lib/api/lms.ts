import { api } from "./client";

export const getCategories = () => api<{ success: boolean; data: any[] }>("/api/categories");

export const getCourses = (params?: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") q.set(k, String(v));
    });
  }
  const qs = q.toString();
  // Always send auth when available so instructor=me / admin filters work
  return api<{ success: boolean; data: any[]; meta?: any }>(
    `/api/courses${qs ? `?${qs}` : ""}`,
    { auth: true }
  );
};

export const getCourse = (id: string) =>
  api<{
    success: boolean;
    data: any;
    enrolled?: boolean;
    reviews?: any[];
    myReview?: any | null;
  }>(`/api/courses/${id}`, { auth: true });

export const createCourse = (body: unknown) =>
  api("/api/courses", { method: "POST", body, auth: true });

export const updateCourse = (id: string, body: unknown) =>
  api(`/api/courses/${id}`, { method: "PUT", body, auth: true });

/** Curriculum */
export const addModule = (courseId: string, body: { title: string; order?: number }) =>
  api(`/api/courses/${courseId}/modules`, { method: "POST", body, auth: true });

export const updateModule = (
  courseId: string,
  moduleId: string,
  body: { title?: string; order?: number },
) =>
  api(`/api/courses/${courseId}/modules/${moduleId}`, {
    method: "PUT",
    body,
    auth: true,
  });

export const deleteModule = (courseId: string, moduleId: string) =>
  api(`/api/courses/${courseId}/modules/${moduleId}`, {
    method: "DELETE",
    auth: true,
  });

export const addLesson = (
  courseId: string,
  moduleId: string,
  body: Record<string, unknown>,
) =>
  api(`/api/courses/${courseId}/modules/${moduleId}/lessons`, {
    method: "POST",
    body,
    auth: true,
  });

export const updateLesson = (
  courseId: string,
  moduleId: string,
  lessonId: string,
  body: Record<string, unknown>,
) =>
  api(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
    method: "PUT",
    body,
    auth: true,
  });

export const deleteLesson = (courseId: string, moduleId: string, lessonId: string) =>
  api(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
    method: "DELETE",
    auth: true,
  });

/** Reviews — create only works for students who purchased the course */
export const listReviews = (courseId: string) =>
  api<{ success: boolean; data: any[] }>(`/api/courses/${courseId}/reviews`);

export const createReview = (courseId: string, body: { rating: number; comment: string }) =>
  api(`/api/courses/${courseId}/reviews`, { method: "POST", body, auth: true });

export const updateReview = (
  courseId: string,
  reviewId: string,
  body: { rating?: number; comment?: string },
) =>
  api(`/api/courses/${courseId}/reviews/${reviewId}`, {
    method: "PUT",
    body,
    auth: true,
  });

export const deleteReview = (courseId: string, reviewId: string) =>
  api(`/api/courses/${courseId}/reviews/${reviewId}`, {
    method: "DELETE",
    auth: true,
  });

export async function uploadFile(file: File, folder = "lms") {
  const { API_URL, getToken } = await import("./client");
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data as {
    success: boolean;
    data: { url: string; publicId: string; format?: string; resourceType?: string };
  };
}
export const searchCourses = (q: string) =>
  api<{ success: boolean; data: any[]; mode?: string }>(
    `/api/search/courses?q=${encodeURIComponent(q)}`
  );

export const checkoutCourse = (courseId: string, couponCode?: string) =>
  api<{ success: boolean; url?: string; free?: boolean; enrollment?: any; message?: string }>(
    `/api/enrollments/${courseId}/checkout`,
    { method: "POST", body: { couponCode }, auth: true }
  );

export const myEnrollments = () =>
  api<{ success: boolean; data: any[] }>("/api/enrollments/mine", { auth: true });

export const updateProgress = (courseId: string, body: { lessonId?: string; progress?: number }) =>
  api(`/api/enrollments/${courseId}/progress`, { method: "PATCH", body, auth: true });

export const validateCoupon = (code: string, courseId: string) =>
  api<{ success: boolean; data: any }>("/api/coupons/validate", {
    method: "POST",
    body: { code, courseId },
  });

export const listCoupons = () =>
  api<{ success: boolean; data: any[] }>("/api/coupons", { auth: true });

export const createCoupon = (body: unknown) =>
  api("/api/coupons", { method: "POST", body, auth: true });

export const deleteCoupon = (id: string) =>
  api(`/api/coupons/${id}`, { method: "DELETE", auth: true });

export const listQuizzes = (course?: string) =>
  api<{ success: boolean; data: any[] }>(
    `/api/quizzes${course ? `?course=${course}` : ""}`,
    { auth: true }
  );

export const getQuiz = (id: string) =>
  api<{ success: boolean; data: any }>(`/api/quizzes/${id}`, { auth: true });

export const submitQuiz = (id: string, answers: unknown[]) =>
  api(`/api/quizzes/${id}/attempt`, { method: "POST", body: { answers }, auth: true });

export const getChannel = (courseId: string) =>
  api<{ success: boolean; data: { channel: any; messages: any[] } }>(
    `/api/channels/course/${courseId}`,
    { auth: true }
  );

export const postChannelMessage = (courseId: string, body: string) =>
  api(`/api/channels/course/${courseId}/messages`, {
    method: "POST",
    body: { body },
    auth: true,
  });

export const listWishlist = () =>
  api<{ success: boolean; data: any[] }>("/api/wishlist", { auth: true });

export const addWishlist = (courseId: string) =>
  api("/api/wishlist", { method: "POST", body: { courseId }, auth: true });

export const removeWishlist = (courseId: string) =>
  api(`/api/wishlist/${courseId}`, { method: "DELETE", auth: true });

export const myCertificates = () =>
  api<{ success: boolean; data: any[] }>("/api/certificates/mine", { auth: true });

export const adminStats = () =>
  api<{ success: boolean; data: any }>("/api/admin/stats", { auth: true });

export const adminUsers = (params?: { role?: string; q?: string }) => {
  const q = new URLSearchParams(params as Record<string, string>).toString();
  return api<{ success: boolean; data: any[] }>(`/api/admin/users${q ? `?${q}` : ""}`, {
    auth: true,
  });
};

export const adminPayments = () =>
  api<{ success: boolean; data: any[] }>("/api/admin/payments", { auth: true });

export const platformStripeStatus = () =>
  api<{ success: boolean; data: any }>("/api/stripe/platform/status", { auth: true });

export const platformStripeConnect = (platformFeePercent = 20) =>
  api("/api/stripe/platform/connect", {
    method: "POST",
    body: { platformFeePercent },
    auth: true,
  });

export const platformStripeDisconnect = () =>
  api("/api/stripe/platform/disconnect", { method: "POST", auth: true });

export const instructorStripeOnboard = () =>
  api<{ success: boolean; url: string }>("/api/stripe/connect/onboard", {
    method: "POST",
    auth: true,
  });

export const instructorStripeStatus = () =>
  api<{ success: boolean; data: any }>("/api/stripe/connect/status", { auth: true });

export const verifyCheckoutSession = (sessionId: string) =>
  api<{ success: boolean; enrolled?: boolean; alreadyPaid?: boolean }>(
    `/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`,
    { auth: true },
  );

export const instructorEarnings = () =>
  api<{ success: boolean; data: any }>("/api/instructor/earnings", { auth: true });

export const instructorStudents = () =>
  api<{ success: boolean; data: any[] }>("/api/instructor/students", { auth: true });

export const createQuiz = (body: unknown) =>
  api("/api/quizzes", { method: "POST", body, auth: true });

export const updateQuiz = (id: string, body: unknown) =>
  api(`/api/quizzes/${id}`, { method: "PUT", body, auth: true });

export const deleteQuiz = (id: string) =>
  api(`/api/quizzes/${id}`, { method: "DELETE", auth: true });

export async function generateQuizFromPdf(form: FormData) {
  const { API_URL, getToken } = await import("./client");
  const token = getToken();
  const res = await fetch(`${API_URL}/api/quizzes/generate-from-pdf`, {
    method: "POST",
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Quiz generation failed");
  return data;
}
