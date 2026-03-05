import { inject, PLATFORM_ID } from '@angular/core'; // Add PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Add this
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const _router = inject(Router);
  const _cookieService = inject(CookieService);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (_cookieService.check('token')) {
    return true;
  } else {
    _router.navigate(['/login']);
    return false;
  }
};
