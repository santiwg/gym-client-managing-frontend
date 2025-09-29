import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {
  registerForm: FormGroup;
  error = '';
  submitted = false;
  successMessage = '';
  constructor(private fb: FormBuilder,private router: Router,private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordValidation: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.passwordsMatchValidator });
  }

  onSubmit() {
    this.register();
  }
  
  async register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error = 'Completa todos los campos correctamente.';
      return;
    }

    const { name, email, password } = this.registerForm.value

    const response = await this.authService.register(email, password);
    if (response.success){
      this.error = '';
      this.successMessage = "User successfully registered"
      setTimeout(() => {
        this.router.navigate(['login'])
      }, 2000)
    }else{
      this.error = response.error;
    }
  }

  // Validador a nivel formulario: marca error solo si ambos campos tienen valor y difieren
  passwordsMatchValidator: ValidatorFn = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value ?? '';
    const confirmPassword = form.get('passwordValidation')?.value ?? '';
    if (!password || !confirmPassword) {
      return null; // dejar que los required/minLength manejen el estado hasta que ambos tengan valor
    }
    return password !== confirmPassword ? { passwordMismatch: true } : null;
  };
}
