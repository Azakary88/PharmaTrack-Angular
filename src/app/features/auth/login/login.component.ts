// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService 
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loginError = null;
    
    // Appeler la méthode login du service
    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        if (user) {
          // Si la connexion réussit, on redirige vers le dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Si la connexion échoue, on affiche un message d'erreur
          this.loginError = 'Nom d\'utilisateur ou mot de passe incorrect.';
        }
      },
      error: (err) => {
        // En cas d'erreur HTTP (ex: l'API ne répond pas)
        this.loginError = 'Une erreur est survenue. Veuillez réessayer.';
        console.error(err);
      }
    });
  }
}
