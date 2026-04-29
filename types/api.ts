// Re-export layer over generated.ts — import from here, not directly from generated.ts.
// To regenerate: npm run generate:types
import type { components } from "./generated";

type S = components["schemas"];

export type { components } from "./generated";

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

export type User            = S["UserResponse"];
export type Token           = S["Token"];
export type Task            = S["TaskResponse"];
export type Habit           = S["HabitResponse"];
export type MealLog         = S["MealLogResponse"];
export type Expense         = S["ExpenseResponse"];
export type ExpenseCategory = S["ExpenseCategory"];
export type Goal            = S["GoalResponse"];
export type GoalCreate      = S["GoalCreate"];
export type GoalCategory    = S["GoalCategory"];
export type GoalStatus      = S["GoalStatus"];
export type HabitFrequency  = S["HabitFrequency"];
export type Milestone       = S["MilestoneResponse"];
export type MilestoneCreate = S["MilestoneCreate"];
export type JobOffer        = S["JobOfferResponse"];
export type OfferStatus     = S["OfferStatus"];
export type DashboardToday  = S["DashboardToday"];
export type ActivityDay     = S["ActivityDay"];
export type ActivityHistory = S["ActivityHistory"];
export type SmartCreateInput    = S["SmartCreateInput"];
export type HustleInputRequest  = S["HustleInputRequest"];
