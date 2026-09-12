/**
 * Boundary for a future native secure-storage implementation.
 * Sprint 1 deliberately creates and stores no private key material.
 */
export interface SecureIdentityStore {
  readPrivateIdentity(): Promise<string | null>;
  writePrivateIdentity(value: string): Promise<void>;
  clearPrivateIdentity(): Promise<void>;
}

export const secureIdentityStorageAvailable = false;
