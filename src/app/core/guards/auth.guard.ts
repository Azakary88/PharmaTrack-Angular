// src/app/core/auth/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  // On injecte les services dont on a besoin
  const authService = inject(AuthService);
  const router = inject(Router);

  // On utilise l'observable isLoggedIn$ de notre service
  return authService.isLoggedIn$.pipe(
    take(1), // On ne prend que la première valeur émise pour éviter les abonnements infinis
    map(isLoggedIn => {
      if (isLoggedIn) {
        // Si l'utilisateur est connecté, on autorise l'accès
        return true;
      } else {
        // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
        console.log('Accès non autorisé. Redirection vers /login');
        router.navigate(['/login']);
        // Et on bloque la navigation actuelle
        return false;
      }
    })
  );
};
