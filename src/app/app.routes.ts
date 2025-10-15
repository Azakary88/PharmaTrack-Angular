// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // --- Routes d'Authentification ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // --- Routes de l'Application (protégées) ---
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    // Seuls les utilisateurs connectés peuvent y accéder
    canActivate: [authGuard] 
  },
  {
    path: 'sales',
    loadComponent: () => import('./features/sales/sales-page/sales-page.component').then(m => m.SalesPageComponent),
    // Seuls les utilisateurs connectés peuvent y accéder
    canActivate: [authGuard]
  },
  {
    path: 'medicines',
    loadComponent: () => import('./features/medicines/medicine-list/medicine-list.component').then(m => m.MedicineListComponent),
    // D'abord, on vérifie si l'utilisateur est connecté.
    // Ensuite, on vérifie s'il a le rôle 'Admin'.
    canActivate: [authGuard, adminGuard] 
  },

  // --- Route par défaut ---
  // Si l'URL est vide, redirige vers la page de connexion.
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Si l'URL ne correspond à aucune route ci-dessus, redirige vers le dashboard.
  // Utile si un utilisateur connecté tape une URL incorrecte.
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
