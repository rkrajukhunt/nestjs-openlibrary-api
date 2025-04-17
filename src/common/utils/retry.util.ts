export async function retry<T>(
  fn: () => Promise<T>,
  retryAttempts: number,
  retryDelay: number,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < retryAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // If this is not the last attempt, wait before retrying
      if (attempt < retryAttempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }

  throw lastError;
}
