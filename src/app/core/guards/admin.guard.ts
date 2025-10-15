// src/app/core/auth/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs/operators';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // On utilise le nouvel observable userRole$
  return authService.userRole$.pipe(
    take(1),
    map(role => {
      console.log(`[AdminGuard] Rôle détecté : ${role}`);
      if (role === 'Admin') {
        // Si le rôle est 'Admin', on autorise l'accès
        return true;
      } else {
        // Pour tout autre cas (pas connecté ou pas Admin), on bloque
        console.warn('[AdminGuard] Accès refusé. Redirection...');
        // On peut les rediriger vers le dashboard, qui est une page moins sensible
        router.navigate(['/dashboard']); 
        return false;
      }
    })
  );
};

