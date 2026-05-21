export function userStorageKey(base: string, userId: string | null): string {
  return userId ? `${base}_${userId}` : base;
}

export function loadUserJson<T>(base: string, userId: string | null, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const key = userStorageKey(base, userId);
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    /* ignore */
  }

  if (userId) {
    try {
      const legacy = localStorage.getItem(base);
      if (legacy) {
        const parsed = JSON.parse(legacy) as T;
        localStorage.setItem(key, legacy);
        localStorage.removeItem(base);
        return parsed;
      }
    } catch {
      /* ignore */
    }
  }

  return fallback;
}

export function saveUserJson<T>(base: string, userId: string | null, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(userStorageKey(base, userId), JSON.stringify(value));
}
