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
        title: 'تسجيل الدحول',
      },
      {
        path: 'forgetpassword',
        loadComponent: () =>
          import('../app/pages/forget-password/forget-password').then((c) => c.ForgetPassword),
        title: 'نسيت كلمة المرور',
      },
      {
        path: 'register',
        loadComponent: () => import('../app/pages/register/register').then((c) => c.Register),
        title: 'تسجيل حساب جديد',
      },
      {
        path: 'submitconfirmationcode',
        loadComponent: () => import('../app/pages/otp/otp').then((c) => c.Otp),
        title: 'تسجيل كلمة تحقق',
      },
      {
        path: 'resetpassword',
        loadComponent: () =>
          import('../app/pages/resetpassword/resetpassword').then((c) => c.Resetpassword),
        title: 'إعادة ضبط كلمة المرور',
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
        title: 'الرئيسة',
      },
      {
        path: 'chatbot/:id',
        loadComponent: () => import('../app/pages/chat-bot/chat-bot').then((c) => c.ChatBot),
        title: 'المساعد الشخصي',
        canActivate: [authGuard],
      },
      {
        path: 'servicedetails/:id',
        loadComponent: () =>
          import('../app/pages/service-details/service-details').then((c) => c.ServiceDetails),
        title: 'تفاصيل الخدمة',
      },
      {
        path: 'requestnewservice',
        loadComponent: () =>
          import('../app/pages/request-service-form/request-service-form').then(
            (c) => c.RequestServiceForm,
          ),
        title: 'طلب خدمة جديده',
        canActivate: [authGuard],
      },
      {
        path: 'all-comments',
        loadComponent: () =>
          import('../app/pages/all-comments/all-comments').then((c) => c.AllComments),
        title: 'جميع التعليقات',
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () => import('../app/pages/profile/profile').then((c) => c.ProfileComponent),
        title: 'الملف الشخصي',
        children: [
          { path: '', redirectTo: 'user-details', pathMatch: 'full' },
          {
            path: 'user-requests',
            loadComponent: () =>
              import('../app/pages/user-requests-component/user-requests-component').then(
                (c) => c.UserRequestsComponent,
              ),
            title: 'طلباتك',
          },
          {
            path: 'user-details',
            loadComponent: () =>
              import('../app/pages/user-details-component/user-details-component').then(
                (c) => c.UserDetailsComponent,
              ),
            title: 'تفاصيل المستخدم',
          },
        ],
      },
      {
        path: '**',
        loadComponent: () => import('../app/pages/wild/wild').then((c) => c.Wild),
        title: 'الصفحة غير موجودة',
      },
    ],
  },
];
