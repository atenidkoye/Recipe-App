import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { authRepository } from "./auth.repository.js";

import type {
  RegisterInput,
  LoginInput,
  AuthResponse
} from "./auth.types.js";

// Read the secret used to sign authentication tokens from environment variables.
const JWT_SECRET = process.env.JWT_SECRET;

// Stop the application from starting if the token secret is missing.
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const authService = {
  // Validate registration details, create the user account, and issue an access token.
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Remove surrounding whitespace and normalize the email for consistent comparisons.
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    // Ensure the required fields contain values before creating the account.
    if (!name || !email || !input.password) {
      throw new Error("All fields are required");
    }

    // Require a minimum password length before hashing and storing the password.
    if (input.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    // Check whether an account already exists with this normalized email address.
    const existingUser = authRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    // Hash the password so the original password is never stored in the database.
    // The cost factor of 12 controls the computational effort used by bcrypt.
    const passwordHash = await bcrypt.hash(input.password, 12);

    // Save the new user through the repository and store only the password hash.
    const user = authRepository.create(
      name,
      email,
      passwordHash
    );

    // Create a signed JWT containing the user's ID.
    // The token expires after 14 days.
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    // Return the created user's public data together with the access token.
    return { user, token };
  },

  // Verify the user's credentials and issue an access token when login succeeds.
  async login(input: LoginInput): Promise<AuthResponse> {
    // Normalize the email in the same way as during registration.
    const email = input.email.trim().toLowerCase();

    // Find the account so its stored password hash can be checked.
    const user = authRepository.findByEmail(email);

    // Reject login when no account matches the supplied email.
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare the supplied password with the stored hash without recovering the original password.
    const passwordMatches = await bcrypt.compare(
      input.password,
      user.password_hash
    );

    // Reject login if the supplied password does not match the stored hash.
    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    // Sign a JWT containing the authenticated user's ID.
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "14d" }
    );

    // Retrieve the public user fields so the password hash is not returned to the client.
    const safeUser = authRepository.findById(user.id);

    if (!safeUser) {
      throw new Error("User not found");
    }

    // Return the safe user profile and the newly issued access token.
    return {
      user: safeUser,
      token
    };
  }
};