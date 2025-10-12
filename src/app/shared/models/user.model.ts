// src/app/shared/models/user.model.ts
export interface User {
  id: number;
  username: string;
  role: 'Admin' | 'User';
  // Le mot de passe ne doit pas être stocké ici dans une vraie application
}
