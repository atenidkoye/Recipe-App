import { usersRepository } from "./users.repository.js";
import type { UpdateUserInput } from "./users.types.js";

// Handles business logic and validation for user accounts.
export const usersService = {
  // Retrieves the authenticated user's profile.
  getProfile(userId: number) {
    const user = usersRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  // Validates and updates the user's name or email.
  updateProfile(userId: number, input: UpdateUserInput) {
    const existingUser = usersRepository.findById(userId);

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Trim the name and normalize the email when those fields are provided.
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();

    if (name !== undefined && !name) {
      throw new Error("Name cannot be empty");
    }

    if (email !== undefined && !email) {
      throw new Error("Email cannot be empty");
    }

    // Check whether the new email is already used by another account.
    if (email !== undefined && email !== existingUser.email) {
      const userWithEmail = usersRepository.findByEmail(email, userId);

      if (userWithEmail) {
        throw new Error("Email is already registered");
      }
    }

    return usersRepository.update(userId, {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
    });
  },
};
