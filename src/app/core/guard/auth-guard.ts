import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // 1. Import this

export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _cookieService = inject(CookieService); // 2. Inject the service

  if (_cookieService.check('token')) {
    return true;
  } else {
    _router.navigate(['/login']);
    return false;
  }
};
