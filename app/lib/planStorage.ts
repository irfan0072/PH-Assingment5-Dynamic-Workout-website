export type StoredWorkout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
};

const PLAN_KEY = 'fitlog-plan';
const SAVED_KEY = 'fitlog-saved';

function readStored(key: string): StoredWorkout[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStored(key: string, items: StoredWorkout[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event('fitlog-plan-change'));
}

export function getPlanItems(): StoredWorkout[] {
  return readStored(PLAN_KEY);
}

export function getSavedItems(): StoredWorkout[] {
  return readStored(SAVED_KEY);
}

export function addToPlan(workout: StoredWorkout): boolean {
  const plan = getPlanItems();

  if (plan.some((item) => item.id === workout.id)) {
    return false;
  }

  if (plan.length >= 5) {
    return false;
  }

  const updated = [...plan, workout];
  writeStored(PLAN_KEY, updated);
  return true;
}

export function addToSaved(workout: StoredWorkout): boolean {
  const saved = getSavedItems();

  if (saved.some((item) => item.id === workout.id)) {
    return false;
  }

  writeStored(SAVED_KEY, [...saved, workout]);
  return true;
}

export function clearPlan() {
  writeStored(PLAN_KEY, []);
}

export function clearSaved() {
  writeStored(SAVED_KEY, []);
}

export function getPlanCount(): number {
  return getPlanItems().length;
}

export function getSavedCount(): number {
  return getSavedItems().length;
}
