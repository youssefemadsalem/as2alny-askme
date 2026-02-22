import { ProfileComponent } from './pages/profile/profile';
import { Routes } from '@angular/router';
import { Auth } from './layouts/auth/auth';
import { Main } from './layouts/main/main';
import { authGuard } from './core/guard/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Auth,
    children: [
      {
        path: 'login',
        loadComponent: () => import('../app/pages/login/login').then((c) => c.Login),
        title: 'login',
      },
      {
        path: 'forgetpassword',
        loadComponent: () =>
          import('../app/pages/forget-password/forget-password').then((c) => c.ForgetPassword),
        title: 'forget',
      },
      {
        path: 'register',
        loadComponent: () => import('../app/pages/register/register').then((c) => c.Register),
        title: 'register',
      },
      {
        path: 'submitconfirmationcode',
        loadComponent: () => import('../app/pages/otp/otp').then((c) => c.Otp),
        title: 'submitcode',
      },
      {
        path: 'resetpassword',
        loadComponent: () =>
          import('../app/pages/resetpassword/resetpassword').then((c) => c.Resetpassword),
        title: 'resetpassword',
      },
    ],
  },

  {
    path: '',
    component: Main,

    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('../app/pages/home/home').then((c) => c.Home),
        title: 'Home',
      },
      {
        path: 'chatbot/:id',
        loadComponent: () => import('../app/pages/chat-bot/chat-bot').then((c) => c.ChatBot),
        title: 'chatbot',
        canActivate: [authGuard],
      },
      {
        path: 'rateus',
        loadComponent: () =>
          import('../app/pages/rating-form/rating-form').then((c) => c.RatingForm),
        title: 'rate-us',
      },
      {
        path: 'servicedetails/:id',
        loadComponent: () =>
          import('../app/pages/service-details/service-details').then((c) => c.ServiceDetails),
        title: 'servicedetails',
      },
      {
        path: 'requestnewservice',
        loadComponent: () =>
          import('../app/pages/request-service-form/request-service-form').then(
            (c) => c.RequestServiceForm,
          ),
        title: 'requestnewservices',
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('../app/pages/profile/profile').then((c) => c.ProfileComponent),
        title: 'profile',
      },
      {
        path: '**',
        loadComponent: () => import('../app/pages/wild/wild').then((c) => c.Wild),
        title: 'wild',
      },
    ],
  },
];
