
export function getCurrentDateISOString() : string {
  return new Date().toISOString()
}

interface PromiseError {
  error: true,
  message: string
}

export function commonErrorHandling(error: unknown): PromiseError {
  if(error instanceof Error) {
    return {error: true, message: error.message}
  }

  return {error: true, message: "Unknown error occured"}
}

export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}