import { Routes } from '@angular/router';
import { TemplatePage } from './pages/template/template-page';
import { HomePage } from './pages/home/home-page';
import { LoginPage } from './pages/auth/login-page/login-page';
import { RegisterPage } from './pages/auth/register-page/register-page';
import { ClientsPage } from './pages/clients/clients-page/clients-page';
import { canActivateFn } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [canActivateFn],
    component: TemplatePage,
    children: [
      {
        path: '',
        component: HomePage,
      },
      {
        path: 'clients',
        component: ClientsPage,
      },
    ],
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
  }
];
