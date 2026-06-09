import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/courses/$id")({ component: CoursePage });

import { CourseHero } from "@/components/courses/CourseHero";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { InstructorSection } from "@/components/courses/InstructorSection";
import { ReviewsSection } from "@/components/courses/ReviewsSection";
import { EnrollmentCard } from "@/components/courses/EnrollmentCard";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { CustomCursor } from "@/components/ui/custom-cursor";

// Mock Data
const COURSE_DATA = {
  id: "1",
  title: "The Art of Modern Architecture: Design & Theory",
  subtitle:
    "Master the principles of contemporary architectural design, from concept to construction.",
  rating: 4.8,
  reviewsCount: 1240,
  studentsCount: 3500,
  updatedAt: "Last updated 10/2023",
  language: "English",
  image:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2689&auto=format&fit=crop",
  price: 89.99,
  originalPrice: 199.99,
  discount: 55,
  description: `
    <p>Unlock the secrets of modern architecture in this comprehensive masterclass. Whether you are a student, a professional architect, or a design enthusiast, this course takes you on a journey through the evolution of architectural theory and practice.</p>
    <p class="mt-4">We will explore the works of legendary architects, dissect iconic buildings, and learn the practical skills needed to create your own designs. From sketching initial concepts to 3D modeling and rendering, you will gain hands-on experience with industry-standard tools.</p>
    <p class="mt-4">This isn't just about learning software; it's about developing a design philosophy. You will learn how to think like an architect, solving complex spatial problems with elegance and functionality.</p>
  `,
  learningPoints: [
    "Master the fundamental principles of modern architectural design",
    "Gain proficiency in industry-standard software like AutoCAD and Revit",
    "Understand the history and evolution of architectural styles",
    "Develop a professional portfolio of design projects",
    "Learn to create photorealistic 3D renderings",
    "Navigate the business side of architecture and client relations",
  ],
  requirements: [
    "No prior experience required - we start from the basics",
    "A computer capable of running architectural software",
    "Passion for design and creativity",
  ],
  features: [
    "45 hours on-demand video",
    "12 downloadable resources",
    "Full lifetime access",
    "Access on mobile and TV",
    "Certificate of completion",
  ],
  instructor: {
    name: "Eleanor Sterling",
    role: "Senior Architect & Design Director",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop",
    bio: "Eleanor Sterling is an award-winning architect with over 15 years of experience in high-end residential and commercial design. Her work has been featured in Architectural Digest and Dwell. She is passionate about mentoring the next generation of designers.",
    rating: 4.9,
    reviews: 850,
    students: 12000,
    courses: 5,
  },
  curriculum: [
    {
      id: "m1",
      title: "Module 1: Foundations of Design",
      duration: "2h 15m",
      lessons: [
        {
          id: "l1",
          title: "Introduction to Architecture",
          duration: "15:00",
          isFree: true,
          type: "video" as const,
        },
        {
          id: "l2",
          title: "Understanding Space and Form",
          duration: "25:30",
          isFree: true,
          type: "video" as const,
        },
        {
          id: "l3",
          title: "The History of Modernism",
          duration: "45:00",
          isFree: false,
          type: "video" as const,
        },
        {
          id: "l4",
          title: "Design Principles Quiz",
          duration: "10:00",
          isFree: false,
          type: "quiz" as const,
        },
      ],
    },
    {
      id: "m2",
      title: "Module 2: Technical Drawing & CAD",
      duration: "3h 45m",
      lessons: [
        {
          id: "l5",
          title: "AutoCAD Interface Basics",
          duration: "30:00",
          isFree: false,
          type: "video" as const,
        },
        {
          id: "l6",
          title: "Drawing Floor Plans",
          duration: "55:00",
          isFree: false,
          type: "video" as const,
        },
        {
          id: "l7",
          title: " Elevations and Sections",
          duration: "45:00",
          isFree: false,
          type: "video" as const,
        },
      ],
    },
    {
      id: "m3",
      title: "Module 3: 3D Modeling & Visualization",
      duration: "4h 10m",
      lessons: [
        {
          id: "l8",
          title: "Intro to Revit",
          duration: "40:00",
          isFree: false,
          type: "video" as const,
        },
        {
          id: "l9",
          title: "Building 3D Models",
          duration: "1:10:00",
          isFree: false,
          type: "video" as const,
        },
        {
          id: "l10",
          title: "Rendering Techniques",
          duration: "50:00",
          isFree: false,
          type: "video" as const,
        },
      ],
    },
  ],
  reviews: [
    {
      id: "r1",
      user: { name: "James Caldwell", initials: "JC" },
      rating: 5,
      date: "2 weeks ago",
      content:
        "This course completely changed my perspective on design. Eleanor is a fantastic instructor who explains complex concepts with ease. Highly recommended!",
      helpful: 12,
    },
    {
      id: "r2",
      user: { name: "Sarah Jenkins", initials: "SJ" },
      rating: 4,
      date: "1 month ago",
      content:
        "Great content, especially the modules on Revit. I wish there were more practice exercises, but overall very valuable.",
      helpful: 5,
    },
  ],
};

const MORE_COURSES = [
  {
    id: "2",
    title: "Advanced Interior Design Masterclass",
    instructor: "Eleanor Sterling",
    thumbnail:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.9,
    reviews: 850,
    duration: "12h 30m",
    level: "Advanced",
    category: "Design",
    bestseller: true,
  },
  {
    id: "3",
    title: "Sustainable Architecture Fundamentals",
    instructor: "Eleanor Sterling",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2626&auto=format&fit=crop",
    price: 79.99,
    originalPrice: 149.99,
    rating: 4.7,
    reviews: 620,
    duration: "8h 15m",
    level: "Beginner",
    category: "Architecture",
    new: true,
  },
];

function CoursePage() {
  const { id } = Route.useParams();
  return (
    <div className="min-h-screen bg-luxury-black text-zinc-100 font-sans pb-20 selection:bg-luxury-gold/30 selection:text-luxury-gold relative overflow-hidden">
      <CustomCursor />
      {/* Background Effects: Abstract Architectural Geometry */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {/* 1. Base Gradient with slight warmth */}
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950 via-black to-zinc-950"></div>

        {/* 2. Isometric Grid Pattern - The "Blueprint" feel */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px",
          }}
        ></div>

        {/* 3. Massive "Golden Sun" Glow - Top Right */}
        <div className="absolute top-[-20%] right-[-10%] w-200 h-200 bg-luxury-gold/10 rounded-full blur-[150px] mix-blend-screen animate-pulse duration-10000"></div>

        {/* 4. Rotating Geometric Shapes - The "Modern Architecture" feel */}
        {/* Large slow-rotating circle outline */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-[10%] w-150 h-150 rounded-full border border-luxury-gold/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] -left-[5%] w-125 h-125 rounded-full border border-dashed border-white/5"
        />

        {/* Floating Square - Lower Right */}
        <motion.div
          animate={{ rotate: 45, y: [0, -20, 0] }}
          transition={{
            rotate: { duration: 0 },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-[20%] -right-[5%] w-100 h-100 border border-luxury-gold/5 rotate-45"
        />

        {/* 5. Spotlight Rays from Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-125 bg-linear-to-b from-luxury-gold/5 to-transparent blur-3xl transform"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full max-w-350 mx-auto bg-black/20 backdrop-blur-xl border-x border-white/5 shadow-[0_0_150px_-50px_rgba(234,179,8,0.1)] min-h-screen">
        <CourseHero
          title={COURSE_DATA.title}
          subtitle={COURSE_DATA.subtitle}
          rating={COURSE_DATA.rating}
          reviewsCount={COURSE_DATA.reviewsCount}
          studentsCount={COURSE_DATA.studentsCount}
          updatedAt={COURSE_DATA.updatedAt}
          language={COURSE_DATA.language}
          instructor={COURSE_DATA.instructor}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column (Left - 2/3) */}
          <div className="lg:col-span-2 space-y-16">
            {/* What you'll learn */}
            <div
              data-cursor="card"
              className="border border-white/5 rounded-2xl p-8 bg-white/2 backdrop-blur-sm"
            >
              <h2 className="text-2xl font-serif text-white mb-6 tracking-tight">
                What you&apos;ll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COURSE_DATA.learningPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <Check className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 leading-relaxed font-light">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content / Curriculum */}
            <CourseCurriculum modules={COURSE_DATA.curriculum} />

            {/* Requirements */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-white tracking-tight">
                Requirements
              </h2>
              <ul className="list-disc pl-5 space-y-3 text-zinc-400 font-light">
                {COURSE_DATA.requirements.map((req, i) => (
                  <li key={i} className="pl-2 marker:text-luxury-gold">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-serif text-white tracking-tight">
                Description
              </h2>
              <div
                className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#d4af37] prose-p:text-zinc-400 prose-p:font-light prose-strong:text-white prose-ul:text-zinc-400 prose-li:marker:text-[#d4af37]"
                dangerouslySetInnerHTML={{ __html: COURSE_DATA.description }}
              />
            </div>

            {/* Instructor */}
            <InstructorSection
              instructor={COURSE_DATA.instructor}
              featuredCourses={MORE_COURSES}
            />

            {/* Reviews */}
            <ReviewsSection
              rating={COURSE_DATA.rating}
              totalReviews={COURSE_DATA.reviewsCount}
              reviews={COURSE_DATA.reviews}
            />
          </div>

          {/* Sidebar Column (Right - 1/3) */}
          <div className="lg:col-span-1 relative">
            <EnrollmentCard
              price={COURSE_DATA.price}
              originalPrice={COURSE_DATA.originalPrice}
              discount={COURSE_DATA.discount}
              features={COURSE_DATA.features}
              thumbnail={COURSE_DATA.image}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

