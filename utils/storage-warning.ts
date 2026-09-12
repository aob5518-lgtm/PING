export function warnStorage(context: string, error: unknown) {
  if (__DEV__) console.warn(`[Ping storage] ${context}`, error);
}
