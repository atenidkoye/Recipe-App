/**
 * Defines the data required to register a new user account.
 * These fields are typically received from the registration request body.
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Defines the credentials required to log in to an existing account.
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Represents the public user information returned by the authentication API.
 * The password and password hash are intentionally excluded.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

/**
 * Defines the successful result returned by registration and login.
 * It contains the public user details and the JWT access token.
 */
export interface AuthResponse {
  user: User;
  token: string;
}