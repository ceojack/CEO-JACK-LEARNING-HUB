export const AUTH_REQUEST_TIMEOUT_MS = 10_000;

export class AuthRequestTimeoutError extends Error {
  constructor() {
    super("Authentication request timed out.");
    this.name = "AuthRequestTimeoutError";
  }
}

export function withAuthRequestTimeout<T>(request: Promise<T>): Promise<T> {
  let timeoutId: number | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new AuthRequestTimeoutError()), AUTH_REQUEST_TIMEOUT_MS);
  });

  return Promise.race([request, timeout]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
}
