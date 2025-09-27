import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { LoginRequest } from '../../interfaces/auth.interface';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    template: `
    <div class="login-container">
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <h2>Iniciar Sesión</h2>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            [(ngModel)]="credentials.email" 
            required 
            #email="ngModel">
          <div *ngIf="email.invalid && email.touched" class="error">
            Email es requerido
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            [(ngModel)]="credentials.password" 
            required 
            #password="ngModel">
          <div *ngIf="password.invalid && password.touched" class="error">
            Contraseña es requerida
          </div>
        </div>

        <button 
          type="submit" 
          [disabled]="loginForm.invalid || isLoading">
          {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  `,
    styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .form-group {
      margin-bottom: 15px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    button {
      width: 100%;
      padding: 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .error {
      color: red;
      font-size: 0.875em;
      margin-top: 5px;
    }
  `]
})
export class LoginComponent {
    credentials: LoginRequest = {
        email: '',
        password: ''
    };

    isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) { }

    async onSubmit() {
        if (this.isLoading) return;

        this.isLoading = true;

        try {
            await this.authService.login(this.credentials);
            this.alertService.success('Inicio de sesión exitoso');
            this.router.navigate(['/dashboard']); // O la ruta que quieras
        } catch (error: any) {
            this.alertService.error(error.message || 'Error al iniciar sesión');
        } finally {
            this.isLoading = false;
        }
    }
}