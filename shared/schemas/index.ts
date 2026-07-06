import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";


export const  loginSchema = z.object({
  email: z.string().email("Invalid operator identity"),
  password: z.string().min(8, "Access key must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

