
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})

export class LoginPage {
  loginForm: FormGroup;
  error = '';
  constructor(private fb: FormBuilder, private router: Router,private authService: AuthService) {
	  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
	  password: ['', [Validators.required]]
	  });
  }

  
  onSubmit() {
    this.login();
  }

  async login() {
	  if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.error = 'Completa todos los campos correctamente.';
	    return;
    }

    const { email, password } = this.loginForm.value
      const response= await this.authService.login(email,password) 
      if (response.success){
        this.error = ''
        localStorage.setItem('accessToken', response.data.accessToken)
        this.router.navigate([''])
      }else{
        this.error = response.error;
      }
  }
}



