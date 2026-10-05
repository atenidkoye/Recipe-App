import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { authRepository } from "./auth.repository.js";

import type {
  RegisterInput,
  LoginInput,
  AuthResponse
} from "./auth.types.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !email || !input.password) {
      throw new Error("All fields are required");
    }

    if (input.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const existingUser = authRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = authRepository.create(
      name,
      email,
      passwordHash
    );

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { user, token };
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const email = input.email.trim().toLowerCase();

    const user = authRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      input.password,
      user.password_hash
    );

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const safeUser = authRepository.findById(user.id);

    if (!safeUser) {
      throw new Error("User not found");
    }

    return {
      user: safeUser,
      token
    };
  }
};