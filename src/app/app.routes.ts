import { Routes } from '@angular/router';
import { TemplatePage } from './pages/template/template-page';
import { HomePage } from './pages/home/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { RegisterPage } from './pages/auth/register-page/register-page';

export const routes: Routes = [
  {
    path: '',
    component: TemplatePage,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'login',
        component: LoginPage
      },
      {
        path: 'register',
        component: RegisterPage
      }
    ],
  },
];
