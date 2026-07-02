// services/auth.ts
export const MOCK_USERS = [
  {
    email: "mario.rossi@student.it",
    password: "React2026!",
    name: "Mario Rossi",
    avatarUri: "https://picsum.photos/seed/mario-rossi/128",
  },
  {
    email: "giulia.bianchi@student.it",
    password: "Expo2026!",
    name: "Giulia Bianchi",
    avatarUri: "https://picsum.photos/seed/giulia-bianchi/128",
  },
  {
    email: "luca.verdi@student.it",
    password: "Mobile2026!",
    name: "Luca Verdi",
    avatarUri: "https://picsum.photos/seed/luca-verdi/128",
  },
];

export interface AuthUser {
  email: string;
  password: string;
  name: string;
  avatarUri: string;
}

export function validateLogin(email: string, password: string): AuthUser | undefined {
  const normalizedEmail = email.trim().toLowerCase();

  return MOCK_USERS.find(
    (user) => user.email.toLowerCase() === normalizedEmail && user.password === password,
  );
}