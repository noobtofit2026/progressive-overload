export type WorkoutSet = {
  id: string;
  user_id: string;
  exercise: string;
  weight: number;
  unit: "kg" | "lb";
  reps: number;
  performed_at: string; // ISO date, e.g. "2026-07-20"
  day_of_week: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun" | null;
  created_at: string;
};

export type BodyWeightEntry = {
  id: string;
  user_id: string;
  weight: number;
  unit: "kg" | "lb";
  logged_at: string; // ISO date
  created_at: string;
};