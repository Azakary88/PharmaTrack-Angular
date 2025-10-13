// src/app/core/auth/interceptors/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next ) => {
  // Ceci est une simulation. Dans une vraie application, on récupérerait
  // le token depuis le AuthService ou le localStorage.
  const fakeAuthToken = 'MON_TOKEN_AUTHENTIFICATION_FACTICE_XYZ123';

  console.log('--- Intercepteur de Token Actif ---');

  // On clone la requête originale, car les requêtes sont immuables.
  const authReq = req.clone({
    // On ajoute un nouvel en-tête 'Authorization'.
    // Le format 'Bearer ' est un standard commun.
    setHeaders: {
      Authorization: `Bearer ${fakeAuthToken}`
    }
  });

  console.log('Nouvel en-tête ajouté :', authReq.headers.get('Authorization'));

  // On passe la requête modifiée au prochain intercepteur ou au backend.
  return next(authReq);
};
