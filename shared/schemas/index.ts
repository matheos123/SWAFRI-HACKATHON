import { z } from "zod";

// Backend password rule: min 8 chars, must contain letters and numbers
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .includes("@", { message: "Invalid email address" }),
  password: passwordSchema,
});

export const RegisterSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .includes("@", { message: "Invalid email address" }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
