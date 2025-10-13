// src/app/core/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
} )
export class AuthService {
  private usersApiUrl = 'http://localhost:3000/users';
  
  // Un BehaviorSubject pour stocker l'état de connexion de l'utilisateur
  private currentUserSubject = new BehaviorSubject<User | null>(null );
  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.currentUser$.pipe(map(user => !!user)); // Un observable qui renvoie true si l'utilisateur est connecté

  constructor(private http: HttpClient, private router: Router ) {
    // On pourrait ajouter ici une logique pour vérifier si l'utilisateur est déjà connecté (ex: via localStorage)
  }

  /**
   * Tente de connecter un utilisateur.
   * @param credentials Les informations d'identification (username, password).
   * @returns Un Observable qui émet l'utilisateur si la connexion réussit, ou null sinon.
   */
  login(credentials: { username: string, password: string }): Observable<User | null> {
    // On récupère tous les utilisateurs de l'API
    return this.http.get<User[]>(this.usersApiUrl ).pipe(
      map(users => {
        // On cherche un utilisateur qui correspond au nom d'utilisateur ET au mot de passe
        // NOTE : Dans une vraie application, le mot de passe ne transiterait jamais comme ça !
        const foundUser = users.find(u => u.username === credentials.username && (u as any).password === credentials.password);
        
        if (foundUser) {
          // Si l'utilisateur est trouvé, on met à jour notre BehaviorSubject
          this.currentUserSubject.next(foundUser);
          console.log('Connexion réussie pour :', foundUser.username);
          return foundUser;
        } else {
          // Si non trouvé, on renvoie null
          console.error('Échec de la connexion : identifiants incorrects.');
          return null;
        }
      })
    );
  }

  /**
   * Déconnecte l'utilisateur.
   */
  logout(): void {
    // On met le sujet à null et on redirige vers la page de connexion
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
