// Represents the public user details returned by the API.
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

// Defines the fields that can be updated in a user's profile.
export interface UpdateUserInput {
  name?: string;
  email?: string;
}
