import { z } from "zod";
import { GoalCategory, GoalStatus, JobStatus, InterviewType } from "../types/api";

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
  category: z.nativeEnum(GoalCategory).default(GoalCategory.PERSONAL),
  target_date: z.string().optional().nullable(),
  status: z.nativeEnum(GoalStatus).default(GoalStatus.IN_PROGRESS),
  milestones: z.array(milestoneSchema).optional(),
});

export const interviewSchema = z.object({
  date: z.string().min(1, "Date is required"),
  type: z.nativeEnum(InterviewType).default(InterviewType.TECH),
  notes: z.string().optional().nullable(),
});

export const jobApplicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  status: z.nativeEnum(JobStatus).default(JobStatus.TO_APPLY),
  listing_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  description_raw: z.string().optional(),
});

export const mealLogSchema = z.object({
  description: z.string().min(1, "Description is required"),
  calories: z.number().nonnegative().optional().nullable(),
  protein: z.number().nonnegative().optional().nullable(),
  carbs: z.number().nonnegative().optional().nullable(),
  fat: z.number().nonnegative().optional().nullable(),
});

export const userProfileSchema = z.object({
  full_name: z.string().optional().nullable(),
  cv_text: z.string().min(50, "CV text is too short, please provide more detail"),
  job_title: z.string().optional().nullable(),
});

export const jobDescriptionRequestSchema = z.object({
  description: z.string().min(1, "Job description is required"),
});
