export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function formatMonthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long"
  }).format(new Date(year, month - 1, 1));
}

export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function shiftMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const next = new Date(year, month - 1 + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
}

export function getMonthGridDates(year: number, month: number): Array<string | null> {
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);
  const leadingBlanks = firstDate.getDay();
  const cells: Array<string | null> = Array.from({ length: leadingBlanks }, () => null);

  for (let day = 1; day <= lastDate.getDate(); day += 1) {
    const date = new Date(year, month - 1, day);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push(iso);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
