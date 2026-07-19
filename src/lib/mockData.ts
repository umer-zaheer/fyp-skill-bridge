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
  { id: "c1", title: "Advanced TypeScript", instructor: "Sarah Lin", enrollments: 1284, revenue: 38420, thumb: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop" },
  { id: "c2", title: "Design Systems with Figma", instructor: "Marco Reyes", enrollments: 982, revenue: 29680, thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" },
  { id: "c3", title: "Data Science 101", instructor: "Priya Nair", enrollments: 874, revenue: 25400, thumb: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop" },
  { id: "c4", title: "React Performance", instructor: "James Cole", enrollments: 712, revenue: 21340, thumb: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" },
  { id: "c5", title: "Product Marketing", instructor: "Hannah Ortiz", enrollments: 654, revenue: 18900, thumb: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" },
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

export const adminUsers = [
  { id: "u1", name: "Aisha Khan", email: "aisha.k@example.com", role: "Student" as const, joined: "2026-06-08", courses: 4, status: "Active" as const, avatar: "AK" },
  { id: "u2", name: "Marco Reyes", email: "marco.r@example.com", role: "Instructor" as const, joined: "2026-06-07", courses: 8, status: "Active" as const, avatar: "MR" },
  { id: "u3", name: "Liam Park", email: "liam.p@example.com", role: "Student" as const, joined: "2026-06-07", courses: 2, status: "Active" as const, avatar: "LP" },
  { id: "u4", name: "Priya Nair", email: "priya.n@example.com", role: "Instructor" as const, joined: "2026-06-06", courses: 5, status: "Active" as const, avatar: "PN" },
  { id: "u5", name: "Diego Alvarez", email: "diego.a@example.com", role: "Student" as const, joined: "2026-06-05", courses: 1, status: "Suspended" as const, avatar: "DA" },
  { id: "u6", name: "Sara Bennett", email: "sara.b@example.com", role: "Student" as const, joined: "2026-06-04", courses: 6, status: "Active" as const, avatar: "SB" },
  { id: "u7", name: "James Cole", email: "james.c@example.com", role: "Instructor" as const, joined: "2026-06-03", courses: 3, status: "Active" as const, avatar: "JC" },
  { id: "u8", name: "Mei Chen", email: "mei.c@example.com", role: "Student" as const, joined: "2026-06-02", courses: 3, status: "Pending" as const, avatar: "MC" },
  { id: "u9", name: "Omar Faruq", email: "omar.f@example.com", role: "Admin" as const, joined: "2026-05-28", courses: 0, status: "Active" as const, avatar: "OF" },
  { id: "u10", name: "Hannah Ortiz", email: "hannah.o@example.com", role: "Instructor" as const, joined: "2026-05-20", courses: 4, status: "Active" as const, avatar: "HO" },
  { id: "u11", name: "Noor Siddiqui", email: "noor.s@example.com", role: "Student" as const, joined: "2026-05-18", courses: 7, status: "Active" as const, avatar: "NS" },
  { id: "u12", name: "Elena Volkova", email: "elena.v@example.com", role: "Student" as const, joined: "2026-05-12", courses: 2, status: "Suspended" as const, avatar: "EV" },
];

export const adminCourses = [
  { id: "c1", title: "Advanced TypeScript", instructor: "Sarah Lin", category: "Development", students: 1284, lessons: 42, price: 79, status: "Published" as const, rating: 4.9, updated: "2026-06-08", thumb: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop" },
  { id: "c2", title: "Design Systems with Figma", instructor: "Marco Reyes", category: "Design", students: 982, lessons: 28, price: 49, status: "Published" as const, rating: 4.8, updated: "2026-06-07", thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop" },
  { id: "c3", title: "Data Science 101", instructor: "Priya Nair", category: "Data", students: 874, lessons: 36, price: 59, status: "Published" as const, rating: 4.7, updated: "2026-06-05", thumb: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop" },
  { id: "c4", title: "React Performance", instructor: "James Cole", category: "Development", students: 712, lessons: 24, price: 69, status: "Published" as const, rating: 4.8, updated: "2026-06-04", thumb: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop" },
  { id: "c5", title: "Product Marketing Mastery", instructor: "Hannah Ortiz", category: "Business", students: 654, lessons: 20, price: 45, status: "Draft" as const, rating: 0, updated: "2026-06-03", thumb: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" },
  { id: "c6", title: "UX Research Sprint", instructor: "Sara Bennett", category: "Design", students: 0, lessons: 16, price: 39, status: "Review" as const, rating: 0, updated: "2026-06-02", thumb: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop" },
  { id: "c7", title: "Modern System Design", instructor: "James Cole", category: "Development", students: 540, lessons: 32, price: 89, status: "Published" as const, rating: 4.9, updated: "2026-05-28", thumb: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop" },
  { id: "c8", title: "SQL for Analysts", instructor: "Priya Nair", category: "Data", students: 421, lessons: 18, price: 35, status: "Archived" as const, rating: 4.5, updated: "2026-04-12", thumb: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop" },
];

export const adminPayments = [
  { id: "TX-1042", student: "Aisha Khan", email: "aisha.k@example.com", item: "Advanced TypeScript", amount: 79, method: "Card", type: "Individual" as const, date: "2026-06-08", status: "Paid" as const },
  { id: "TX-1041", student: "Liam Park", email: "liam.p@example.com", item: "Pro Plan", amount: 19, method: "PayPal", type: "Subscription" as const, date: "2026-06-08", status: "Paid" as const },
  { id: "TX-1040", student: "Noor Siddiqui", email: "noor.s@example.com", item: "Design Systems", amount: 49, method: "Card", type: "Individual" as const, date: "2026-06-07", status: "Paid" as const },
  { id: "TX-1039", student: "Diego Alvarez", email: "diego.a@example.com", item: "Enterprise Plan", amount: 49, method: "Card", type: "Subscription" as const, date: "2026-06-07", status: "Paid" as const },
  { id: "TX-1038", student: "Mei Chen", email: "mei.c@example.com", item: "Data Science 101", amount: 59, method: "Card", type: "Individual" as const, date: "2026-06-06", status: "Refunded" as const },
  { id: "TX-1037", student: "Omar Faruq", email: "omar.f@example.com", item: "Pro Plan", amount: 19, method: "Bank", type: "Subscription" as const, date: "2026-06-06", status: "Paid" as const },
  { id: "TX-1036", student: "Sara Bennett", email: "sara.b@example.com", item: "UX Research Sprint", amount: 39, method: "Card", type: "Individual" as const, date: "2026-06-05", status: "Paid" as const },
  { id: "TX-1035", student: "Elena Volkova", email: "elena.v@example.com", item: "React Performance", amount: 69, method: "Card", type: "Individual" as const, date: "2026-06-04", status: "Failed" as const },
  { id: "TX-1034", student: "Hannah Ortiz", email: "hannah.o@example.com", item: "Pro Plan", amount: 19, method: "PayPal", type: "Subscription" as const, date: "2026-06-03", status: "Paid" as const },
  { id: "TX-1033", student: "James Cole", email: "james.c@example.com", item: "Modern System Design", amount: 89, method: "Card", type: "Individual" as const, date: "2026-06-02", status: "Paid" as const },
];

export const moderationQueue = [
  { id: "m1", type: "Review" as const, title: "Spam review on Advanced TypeScript", author: "guest_9921", target: "Advanced TypeScript", severity: "High" as const, submitted: "2026-06-08 · 14:22", excerpt: "Buy cheap certificates at spam-link.xyz — ignore this course!" },
  { id: "m2", type: "Course" as const, title: "UX Research Sprint awaiting approval", author: "Sara Bennett", target: "UX Research Sprint", severity: "Medium" as const, submitted: "2026-06-08 · 11:05", excerpt: "New course submission with 16 lessons and 3 quizzes." },
  { id: "m3", type: "Comment" as const, title: "Harassment in lesson discussion", author: "Diego Alvarez", target: "React Performance · L12", severity: "High" as const, submitted: "2026-06-07 · 19:40", excerpt: "Personal attacks directed at another student in the Q&A thread." },
  { id: "m4", type: "Report" as const, title: "Copyright claim on course media", author: "RightsBot", target: "Design Systems with Figma", severity: "Critical" as const, submitted: "2026-06-07 · 09:12", excerpt: "Third-party claimed ownership of module 4 video assets." },
  { id: "m5", type: "Review" as const, title: "Off-topic 1-star review", author: "Mei Chen", target: "Data Science 101", severity: "Low" as const, submitted: "2026-06-06 · 16:50", excerpt: "Doesn't mention the course — complains about shipping delays." },
  { id: "m6", type: "User" as const, title: "Suspicious multi-account signup", author: "System", target: "elena.v@example.com", severity: "Medium" as const, submitted: "2026-06-05 · 08:30", excerpt: "Same device fingerprint linked to 4 suspended accounts." },
];

export const trafficBySource = [
  { source: "Organic", visits: 12400 },
  { source: "Direct", visits: 8200 },
  { source: "Referral", visits: 5400 },
  { source: "Social", visits: 4100 },
  { source: "Paid", visits: 2900 },
];

export const completionByCategory = [
  { category: "Development", rate: 78 },
  { category: "Design", rate: 72 },
  { category: "Data", rate: 68 },
  { category: "Business", rate: 61 },
  { category: "Marketing", rate: 55 },
];

export const dailyActiveUsers = [
  { day: "Mon", users: 2140 },
  { day: "Tue", users: 2380 },
  { day: "Wed", users: 2210 },
  { day: "Thu", users: 2560 },
  { day: "Fri", users: 2480 },
  { day: "Sat", users: 1890 },
  { day: "Sun", users: 1720 },
];

// ---------- Instructor tenant (Sarah Lin) ----------

export const instructorKpis = {
  totalStudents: { value: 2840, trend: 14 },
  activeCourses: { value: 5, trend: 1 },
  monthlyEarnings: { value: 8640, trend: 18 },
  avgRating: { value: 4.85, trend: 2 },
};

export const instructorEarningsTrend = [
  { month: "Jan", earnings: 4200, payouts: 3800 },
  { month: "Feb", earnings: 5100, payouts: 4600 },
  { month: "Mar", earnings: 5800, payouts: 5200 },
  { month: "Apr", earnings: 5400, payouts: 5100 },
  { month: "May", earnings: 6700, payouts: 6100 },
  { month: "Jun", earnings: 7200, payouts: 6800 },
  { month: "Jul", earnings: 7800, payouts: 7200 },
  { month: "Aug", earnings: 8100, payouts: 7600 },
  { month: "Sep", earnings: 7900, payouts: 7400 },
  { month: "Oct", earnings: 8400, payouts: 7900 },
  { month: "Nov", earnings: 8900, payouts: 8400 },
  { month: "Dec", earnings: 8640, payouts: 8200 },
];

export const instructorEnrollmentTrend = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 145 },
  { month: "Mar", enrollments: 168 },
  { month: "Apr", enrollments: 152 },
  { month: "May", enrollments: 190 },
  { month: "Jun", enrollments: 210 },
  { month: "Jul", enrollments: 198 },
  { month: "Aug", enrollments: 225 },
  { month: "Sep", enrollments: 240 },
  { month: "Oct", enrollments: 256 },
  { month: "Nov", enrollments: 272 },
  { month: "Dec", enrollments: 248 },
];

export const instructorCourses = [
  { id: "ic1", title: "Advanced TypeScript", category: "Development", students: 1284, lessons: 42, price: 79, status: "Published" as const, rating: 4.9, revenue: 38420, completion: 76, updated: "2026-06-08", thumb: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop" },
  { id: "ic2", title: "TypeScript Generics Masterclass", category: "Development", students: 642, lessons: 18, price: 49, status: "Published" as const, rating: 4.8, revenue: 19240, completion: 81, updated: "2026-06-02", thumb: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop" },
  { id: "ic3", title: "Node.js Production Patterns", category: "Development", students: 518, lessons: 30, price: 69, status: "Published" as const, rating: 4.7, revenue: 15600, completion: 68, updated: "2026-05-28", thumb: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop" },
  { id: "ic4", title: "Full-Stack Testing Guide", category: "Development", students: 0, lessons: 22, price: 55, status: "Draft" as const, rating: 0, revenue: 0, completion: 0, updated: "2026-06-07", thumb: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" },
  { id: "ic5", title: "API Design with Zod", category: "Development", students: 0, lessons: 14, price: 39, status: "Review" as const, rating: 0, revenue: 0, completion: 0, updated: "2026-06-05", thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" },
];

export const instructorStudents = [
  { id: "is1", name: "Aisha Khan", email: "aisha.k@example.com", course: "Advanced TypeScript", progress: 86, enrolled: "2026-05-12", lastActive: "2h ago", status: "Active" as const, avatar: "AK" },
  { id: "is2", name: "Liam Park", email: "liam.p@example.com", course: "Advanced TypeScript", progress: 42, enrolled: "2026-05-20", lastActive: "1d ago", status: "Active" as const, avatar: "LP" },
  { id: "is3", name: "Noor Siddiqui", email: "noor.s@example.com", course: "TypeScript Generics Masterclass", progress: 100, enrolled: "2026-04-08", lastActive: "3d ago", status: "Completed" as const, avatar: "NS" },
  { id: "is4", name: "Diego Alvarez", email: "diego.a@example.com", course: "Node.js Production Patterns", progress: 18, enrolled: "2026-06-01", lastActive: "5d ago", status: "At risk" as const, avatar: "DA" },
  { id: "is5", name: "Sara Bennett", email: "sara.b@example.com", course: "Advanced TypeScript", progress: 67, enrolled: "2026-05-02", lastActive: "4h ago", status: "Active" as const, avatar: "SB" },
  { id: "is6", name: "Mei Chen", email: "mei.c@example.com", course: "Node.js Production Patterns", progress: 91, enrolled: "2026-04-22", lastActive: "12h ago", status: "Active" as const, avatar: "MC" },
  { id: "is7", name: "Elena Volkova", email: "elena.v@example.com", course: "TypeScript Generics Masterclass", progress: 55, enrolled: "2026-05-28", lastActive: "2d ago", status: "Active" as const, avatar: "EV" },
  { id: "is8", name: "Omar Faruq", email: "omar.f@example.com", course: "Advanced TypeScript", progress: 8, enrolled: "2026-06-06", lastActive: "6d ago", status: "At risk" as const, avatar: "OF" },
];

export const instructorQuizzes = [
  { id: "iq1", title: "Generics Deep Dive Quiz", course: "Advanced TypeScript", questions: 12, attempts: 486, avgScore: 84, passRate: 78, status: "Published" as const },
  { id: "iq2", title: "Type Narrowing Challenge", course: "Advanced TypeScript", questions: 8, attempts: 392, avgScore: 79, passRate: 72, status: "Published" as const },
  { id: "iq3", title: "Conditional Types Exam", course: "TypeScript Generics Masterclass", questions: 15, attempts: 210, avgScore: 71, passRate: 65, status: "Published" as const },
  { id: "iq4", title: "Node Error Handling", course: "Node.js Production Patterns", questions: 10, attempts: 168, avgScore: 88, passRate: 82, status: "Published" as const },
  { id: "iq5", title: "Testing Pyramid Draft", course: "Full-Stack Testing Guide", questions: 6, attempts: 0, avgScore: 0, passRate: 0, status: "Draft" as const },
];

export const instructorPayouts = [
  { id: "PO-8821", period: "May 2026", amount: 6100, method: "Bank transfer", status: "Paid" as const, date: "2026-06-01" },
  { id: "PO-8790", period: "Apr 2026", amount: 5100, method: "Bank transfer", status: "Paid" as const, date: "2026-05-01" },
  { id: "PO-8754", period: "Mar 2026", amount: 5200, method: "PayPal", status: "Paid" as const, date: "2026-04-01" },
  { id: "PO-8840", period: "Jun 2026", amount: 6800, method: "Bank transfer", status: "Pending" as const, date: "2026-07-01" },
  { id: "PO-8701", period: "Feb 2026", amount: 4600, method: "Bank transfer", status: "Paid" as const, date: "2026-03-01" },
];

export const instructorSales = [
  { id: "IS-441", student: "Aisha Khan", course: "Advanced TypeScript", amount: 79, date: "2026-06-08", status: "Paid" as const },
  { id: "IS-440", student: "Liam Park", course: "TypeScript Generics Masterclass", amount: 49, date: "2026-06-07", status: "Paid" as const },
  { id: "IS-439", student: "Mei Chen", course: "Node.js Production Patterns", amount: 69, date: "2026-06-06", status: "Paid" as const },
  { id: "IS-438", student: "Sara Bennett", course: "Advanced TypeScript", amount: 79, date: "2026-06-05", status: "Refunded" as const },
  { id: "IS-437", student: "Noor Siddiqui", course: "Advanced TypeScript", amount: 79, date: "2026-06-04", status: "Paid" as const },
];

export const instructorLiveSessions = [
  { id: "il1", title: "Generics Deep Dive — Live", course: "Advanced TypeScript", date: "Today", time: "4:00 PM", duration: "60 min", attendees: 84, capacity: 100, status: "Upcoming" as const },
  { id: "il2", title: "Office Hours: TypeScript Q&A", course: "Advanced TypeScript", date: "Tomorrow", time: "11:00 AM", duration: "45 min", attendees: 32, capacity: 50, status: "Upcoming" as const },
  { id: "il3", title: "Node Production Debugging", course: "Node.js Production Patterns", date: "Thu", time: "6:30 PM", duration: "90 min", attendees: 56, capacity: 80, status: "Upcoming" as const },
  { id: "il4", title: "Conditional Types Workshop", course: "TypeScript Generics Masterclass", date: "Jun 2", time: "5:00 PM", duration: "60 min", attendees: 71, capacity: 80, status: "Completed" as const },
  { id: "il5", title: "Error Boundaries Live Lab", course: "Node.js Production Patterns", date: "May 28", time: "3:00 PM", duration: "75 min", attendees: 48, capacity: 60, status: "Completed" as const },
];

export const instructorReviews = [
  { id: "ir1", student: "Aisha Khan", course: "Advanced TypeScript", rating: 5, date: "2026-06-07", body: "Best TypeScript course I've taken. The generics modules finally clicked.", replied: false },
  { id: "ir2", student: "Liam Park", course: "TypeScript Generics Masterclass", rating: 5, date: "2026-06-05", body: "Crystal-clear explanations and great exercises.", replied: true },
  { id: "ir3", student: "Diego Alvarez", course: "Node.js Production Patterns", rating: 3, date: "2026-06-04", body: "Solid content but some videos feel outdated around Express middleware.", replied: false },
  { id: "ir4", student: "Mei Chen", course: "Advanced TypeScript", rating: 4, date: "2026-06-02", body: "Loved the quizzes. Would like more real-world project walkthroughs.", replied: true },
  { id: "ir5", student: "Noor Siddiqui", course: "Advanced TypeScript", rating: 5, date: "2026-05-30", body: "Worth every dollar. Sarah explains complex topics so well.", replied: false },
  { id: "ir6", student: "Omar Faruq", course: "Node.js Production Patterns", rating: 2, date: "2026-05-28", body: "Audio quality is inconsistent in module 4.", replied: false },
];

export const instructorCoursePerformance = [
  { course: "Adv. TS", students: 1284, completion: 76, rating: 4.9 },
  { course: "Generics", students: 642, completion: 81, rating: 4.8 },
  { course: "Node.js", students: 518, completion: 68, rating: 4.7 },
];

export const instructorWeeklyEngagement = [
  { day: "Mon", views: 420, completions: 38 },
  { day: "Tue", views: 510, completions: 52 },
  { day: "Wed", views: 480, completions: 44 },
  { day: "Thu", views: 620, completions: 61 },
  { day: "Fri", views: 580, completions: 55 },
  { day: "Sat", views: 340, completions: 28 },
  { day: "Sun", views: 290, completions: 22 },
];
