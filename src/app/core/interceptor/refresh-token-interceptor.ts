import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Auth } from '../services/auth/auth';

let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
  null,
);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authService = inject(Auth);

  const token = authService.getToken;

  let authReq = req;
  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
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

        const newToken = response.data.accessToken;

        refreshTokenSubject.next(newToken);

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
      switchMap((token) => {
        return next(addTokenHeader(request, token!));
      }),
    );
  }
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
}
