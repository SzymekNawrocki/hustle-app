export enum GoalCategory {
  CAREER = "CAREER",
  FINANCE = "FINANCE",
  HEALTH = "HEALTH",
  PERSONAL = "PERSONAL",
}

export enum GoalStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export enum HabitFrequency {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
}

export enum JobStatus {
  TO_APPLY = "TO_APPLY",
  APPLIED = "APPLIED",
  INTERVIEWING = "INTERVIEWING",
  OFFER = "OFFER",
  REJECTED = "REJECTED",
}

export enum InterviewType {
  HR = "HR",
  TECH = "TECH",
  FINAL = "FINAL",
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  due_date: string | null;
  goal_id: number | null;
  user_id: number;
}

export interface Habit {
  id: number;
  title: string;
  frequency: HabitFrequency;
  streak: number;
  user_id: number;
}

export interface DashboardToday {
  tasks: Task[];
  habits: Habit[];
  finance_balance: number;
  health_calories: number;
  active_goals_count: number;
}

export interface SmartCreateInput {
  idea: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface Milestone {
  id: number;
  title: string;
  is_completed: boolean;
  goal_id: number;
}

export interface MilestoneCreate {
  title: string;
  is_completed?: boolean;
}

export interface Goal {
  id: number;
  title: string;
  description: string | null;
  category: GoalCategory;
  target_date: string | null;
  status: GoalStatus;
  user_id: number;
  milestones: Milestone[];
  tasks: Task[];
  progress_percentage?: number;
}

export interface GoalCreate {
  title: string;
  description?: string;
  category?: GoalCategory;
  target_date?: string;
  status?: GoalStatus;
  milestones?: MilestoneCreate[];
}

export interface Interview {
  id: number;
  date: string;
  type: InterviewType;
  notes: string | null;
  application_id: number;
}

export interface InterviewCreate {
  date: string;
  type: InterviewType;
  notes?: string;
  application_id: number;
}

export interface JobApplication {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  listing_url: string | null;
  description_raw: string | null;
  match_score: number | null;
  created_at: string;
  user_id: number;
  interviews: Interview[];
}

export interface JobApplicationCreate {
  company: string;
  position: string;
  status?: JobStatus;
  listing_url?: string;
  description_raw?: string;
}

export interface MealLog {
  id: number;
  description: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  user_id: number;
  created_at: string;
}

export interface MealLogCreate {
  description: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export type OfferStatus = "wysłano" | "1 etap" | "2 etap" | "3 etap" | "umowa";

export interface JobOffer {
  id: number;
  title: string;
  company?: string | null;
  status: OfferStatus;
  url: string;
  notes?: string | null;
  user_id: number;
}

export interface UserProfile {
  id: number;
  user_id: number;
  full_name: string | null;
  cv_text: string | null;
  job_title: string | null;
}

export interface UserProfileUpdate {
  full_name?: string;
  cv_text?: string;
  job_title?: string;
}

export interface JobDescriptionRequest {
  description: string;
}

export interface CareerAnalysisResponse {
  match_score: number;
  pros: string[];
  cons: string[];
  missing_skills: string[];
  summary: string;
}

export enum ExpenseCategory {
  OPLATY = "OPLATY",
  HUSTLE = "HUSTLE",
  LIFESTYLE = "LIFESTYLE",
  INCOME = "INCOME",
}

export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  description: string;
  timestamp: string;
  user_id: number;
}

export interface HustleInputRequest {
  text: string;
}
