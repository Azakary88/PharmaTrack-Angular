// src/app/shared/models/user.model.ts
export interface User {
  id: number;
  username: string;
  role: 'Admin' | 'User';
}
