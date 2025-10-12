// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
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
    redirectTo: 'medicines',
    pathMatch: 'full'
  }
];
