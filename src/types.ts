export interface User {
  id: string;
  email: string;
  name: string;
}

export type UserLoginSignUpFormat =  {
  error: false
} | {
  error: true,
  message: string
}

export interface AppwriteError {
  message: string
}