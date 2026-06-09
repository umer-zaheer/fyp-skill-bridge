import { createFileRoute } from "@tanstack/react-router";
import { CourseLearn } from "./student.courses.$id";

export const Route = createFileRoute("/student/course/$id")({ component: CourseLearn });
