import type { OfferStatus, ExpenseCategory } from "@/types/api";

export const JOB_STATUSES: OfferStatus[] = ["wysłano", "1 etap", "2 etap", "3 etap", "umowa"];

export const JOB_STATUS_LABELS: Record<OfferStatus, string> = {
  "wysłano": "Sent",
  "1 etap":  "Stage 1",
  "2 etap":  "Stage 2",
  "3 etap":  "Stage 3",
  "umowa":   "Offer",
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = ["EXPENSES", "HUSTLE", "LIFESTYLE", "INCOME"];

export const EXPENSE_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  EXPENSES:  "#ff4d4d",
  HUSTLE:    "#7B2EFF",
  LIFESTYLE: "#00D4FF",
  INCOME:    "#22c55e",
};
