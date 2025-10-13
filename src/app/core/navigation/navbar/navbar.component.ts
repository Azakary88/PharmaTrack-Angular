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
  public isLoggedIn$: Observable<boolean>; // 2. Créer un observable

  constructor(private authService: AuthService) {
    // 3. Lier notre observable à celui du service
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  // 4. Méthode pour appeler la déconnexion
  logout(): void {
    this.authService.logout();
  }
}
