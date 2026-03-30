export const saveItem = (key: string, value: string): void => { try { localStorage.setItem(key, value); } catch { /* */ } };
export const readItem = (key: string): string | null => { try { return localStorage.getItem(key); } catch { return null; } };
export const removeItem = (key: string): void => { try { localStorage.removeItem(key); } catch {  /* */ } };
