export type Weekday = 0|1|2|3|4|5|6;

export type HabitReminder = {
  habitId: string;
  hour: number;
  minute: number;
  days: Weekday[];
};

export async function ensureNotificationPermission(): Promise<boolean> { return true; }
export async function scheduleReminder(_r: HabitReminder): Promise<string> { return 'shim'; }
export async function cancelReminder(_habitId: string): Promise<void> { /* noop */ }
