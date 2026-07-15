export type UserProfile = {
  language: string;
  email: string;
  phone: string;
  name: string;
  reminderTime: string;
  timeZone?: string;
  birthdate: string;
  birthTime: string;
  birthCity: string;
  birthState: string;
  birthCountry: string;
  currentCity: string;
  currentState: string;
  currentCountry: string;
  passwordHash?: string;
  authProvider?: "password" | "google";
};
