// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    {
      path: 'login',
      loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
      path: 'dashboard',
      loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
      canActivate: [authGuard] //  Appliquer le garde à cette route
    },
    {
      path: 'medicines',
      loadComponent: () => import('./features/medicines/medicine-list/medicine-list.component').then(m => m.MedicineListComponent),
      canActivate: [authGuard] //  Appliquer aussi le garde ici
    },
   

    //  la route pour le login
    {
      path: 'login',
      loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
    },

    // On définit la route pour le dashboard
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },

    // 1. Route pour afficher la liste des médicaments
    // Quand l'URL est /medicines, charge le MedicineListComponent
    {
      path: 'medicines',
      loadComponent: () =>
        import('./features/medicines/medicine-list/medicine-list.component').then(m => m.MedicineListComponent)
    },

    // 2. Route par défaut (redirection)
    // Quand l'URL est vide (page d'accueil), redirige vers /medicines
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },

  ];
