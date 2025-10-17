import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public isLoggedIn$: Observable<boolean>; // Créer un observable

  constructor(private authService: AuthService) {
    //  Lier notre observable à celui du service
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  // Méthode pour appeler la déconnexion
  logout(): void {
    this.authService.logout();
  }
}
