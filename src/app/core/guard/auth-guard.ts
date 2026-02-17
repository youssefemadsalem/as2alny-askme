import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);

  if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('token')) {
    return true;
  } else {
    _Router.navigate(['/login']);
    return false;
  }
};
