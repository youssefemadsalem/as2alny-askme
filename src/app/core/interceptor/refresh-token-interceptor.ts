import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { Auth } from '../services/auth/auth';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
  null,
);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const platformId = inject(PLATFORM_ID);

  // 1. Skip SSR - only run in browser
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = authService.getToken;
  let authReq = req;

  // Attach token if it exists
  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      // 2. Handle 401 Errors
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Stop if we are already on login or refresh to prevent infinite loops
        if (req.url.includes('login') || req.url.includes('refresh-token')) {
          return throwError(() => error);
        }
        return handle401Error(authReq, next, authService);
      }
      return throwError(() => error);
    }),
  );
};

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: Auth,
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshTokens().pipe(
      switchMap((response: any) => {
        isRefreshing = false;

        // 1. Get the new token from the "tokens" box
        const newToken = response?.tokens?.accessToken;

        console.log('Successfully got NEW token:', newToken); // Check your console for this!

        if (!newToken) {
          authService.logOut();
          return throwError(() => new Error('No token found in response'));
        }

        // 2. Tell the app we have a new token
        refreshTokenSubject.next(newToken);

        // 3. RETRY the failed request with the NEW key
        return next(addTokenHeader(request, newToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logOut();
        return throwError(() => err);
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token!))),
    );
  }
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
}
