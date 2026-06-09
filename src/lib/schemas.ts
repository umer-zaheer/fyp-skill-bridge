// lib/schemas.ts
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  // Role is handled programmatically, but we validate it exists
  role: z.enum(["student", "instructor"]),
});
