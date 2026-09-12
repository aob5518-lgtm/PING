let sequence = 0;

/** Unique enough for local entity IDs; not intended for secrets or authentication. */
export function createId(prefix: string) {
  sequence = (sequence + 1) % Number.MAX_SAFE_INTEGER;
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 12);
  return `${prefix}-${timestamp}-${sequence.toString(36)}-${random}`;
}
