// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [

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
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

];
