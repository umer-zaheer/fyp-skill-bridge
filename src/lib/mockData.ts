// Mock data for the EduFlow LMS dashboards.

export const monthlyRevenue = [
  { month: "Jan", total: 24500, subscriptions: 14200, individual: 10300 },
  { month: "Feb", total: 28900, subscriptions: 16400, individual: 12500 },
  { month: "Mar", total: 31200, subscriptions: 17900, individual: 13300 },
  { month: "Apr", total: 29800, subscriptions: 17100, individual: 12700 },
  { month: "May", total: 35400, subscriptions: 20200, individual: 15200 },
  { month: "Jun", total: 39800, subscriptions: 22700, individual: 17100 },
  { month: "Jul", total: 42100, subscriptions: 24000, individual: 18100 },
  { month: "Aug", total: 45600, subscriptions: 26000, individual: 19600 },
  { month: "Sep", total: 48900, subscriptions: 27900, individual: 21000 },
  { month: "Oct", total: 52400, subscriptions: 29900, individual: 22500 },
  { month: "Nov", total: 56800, subscriptions: 32400, individual: 24400 },
  { month: "Dec", total: 61200, subscriptions: 34900, individual: 26300 },
];

export const enrollmentTrends = monthlyRevenue.map((m, i) => ({
  month: m.month,
  enrollments: 320 + i * 45 + Math.round(Math.sin(i) * 40),
}));

export const recentTransactions = [
  { id: "TX-1042", student: "Aisha Khan", course: "Advanced TypeScript", amount: 79, type: "Individual", date: "2026-06-08", status: "Paid" },
  { id: "TX-1041", student: "Liam Park", course: "Pro Plan", amount: 19, type: "Subscription", date: "2026-06-08", status: "Paid" },
  { id: "TX-1040", student: "Noor Siddiqui", course: "Design Systems", amount: 49, type: "Individual", date: "2026-06-07", status: "Paid" },
  { id: "TX-1039", student: "Diego Alvarez", course: "Enterprise Plan", amount: 49, type: "Subscription", date: "2026-06-07", status: "Paid" },
  { id: "TX-1038", student: "Mei Chen", course: "Data Science 101", amount: 59, type: "Individual", date: "2026-06-06", status: "Refunded" },
  { id: "TX-1037", student: "Omar Faruq", course: "Pro Plan", amount: 19, type: "Subscription", date: "2026-06-06", status: "Paid" },
  { id: "TX-1036", student: "Sara Bennett", course: "UX Research Sprint", amount: 39, type: "Individual", date: "2026-06-05", status: "Paid" },
];

export const topCourses = [
  { id: "c1", title: "Advanced TypeScript", instructor: "Sarah Lin", enrollments: 1284, revenue: 38420, thumb: "https://placehold.co/80x60/6366F1/FFFFFF/png?text=TS" },
  { id: "c2", title: "Design Systems with Figma", instructor: "Marco Reyes", enrollments: 982, revenue: 29680, thumb: "https://placehold.co/80x60/8B5CF6/FFFFFF/png?text=DS" },
  { id: "c3", title: "Data Science 101", instructor: "Priya Nair", enrollments: 874, revenue: 25400, thumb: "https://placehold.co/80x60/10B981/FFFFFF/png?text=DS" },
  { id: "c4", title: "React Performance", instructor: "James Cole", enrollments: 712, revenue: 21340, thumb: "https://placehold.co/80x60/F59E0B/FFFFFF/png?text=R" },
  { id: "c5", title: "Product Marketing", instructor: "Hannah Ortiz", enrollments: 654, revenue: 18900, thumb: "https://placehold.co/80x60/EF4444/FFFFFF/png?text=PM" },
];

export const recentUsers = [
  { id: "u1", name: "Aisha Khan", role: "Student", joined: "2026-06-08", status: true, avatar: "AK" },
  { id: "u2", name: "Marco Reyes", role: "Instructor", joined: "2026-06-07", status: true, avatar: "MR" },
  { id: "u3", name: "Liam Park", role: "Student", joined: "2026-06-07", status: true, avatar: "LP" },
  { id: "u4", name: "Priya Nair", role: "Instructor", joined: "2026-06-06", status: true, avatar: "PN" },
  { id: "u5", name: "Diego Alvarez", role: "Student", joined: "2026-06-05", status: false, avatar: "DA" },
];

export const kpis = {
  totalStudents: { value: 12480, trend: 12 },
  totalInstructors: { value: 186, trend: 5 },
  totalCourses: { value: 342, trend: 8 },
  totalRevenue: { value: 496300, trend: 23 },
};
