import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name is required"),
});

export const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  is_completed: z.boolean().default(false),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["CAREER", "FINANCE", "HEALTH", "PERSONAL"]).default("PERSONAL"),
  target_date: z.string().optional().nullable(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("IN_PROGRESS"),
  milestones: z.array(milestoneSchema).optional(),
});

export const mealLogSchema = z.object({
  description: z.string().min(1, "Description is required"),
  calories: z.number().nonnegative().optional().nullable(),
  protein: z.number().nonnegative().optional().nullable(),
  carbs: z.number().nonnegative().optional().nullable(),
  fat: z.number().nonnegative().optional().nullable(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "Password must be at least 6 characters").max(128),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
