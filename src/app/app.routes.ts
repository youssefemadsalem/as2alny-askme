import { Auth } from './layouts/auth/auth';
import { Main } from './layouts/main/main';
import { Home } from './pages/home/home';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    component: Auth,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('../app/pages/home/home').then((c) => c.Home),
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
    ],
  },

  {
    path: '',
    component: Main,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../app/pages/home/home').then((c) => c.Home),
        title: 'Home',
      },
      {
        path: 'chatbot/:id',
        loadComponent: () => import('../app/pages/chat-bot/chat-bot').then((c) => c.ChatBot),
        title: 'chatbot',
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
      },
      {
        path: '**',
        loadComponent: () => import('../app/pages/wild/wild').then((c) => c.Wild),
        title: 'wild',
      },
    ],
  },
];
