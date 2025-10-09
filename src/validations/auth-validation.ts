import z from "zod";

// validasi
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid Email"),
  password: z.string().min(1, "Password is required"),
});

// type
export type LoginForm = z.infer<typeof loginSchema>;
