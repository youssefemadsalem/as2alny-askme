import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptor } from './core/interceptor/refresh-token-interceptor';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
    ),

    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    CookieService,
    provideHotToastConfig({
      position: 'top-center',

      className:
        '!bg-white/80 !backdrop-blur-xl !border !border-white/60 !rounded-3xl !shadow-2xl !font-cairo !text-secondary !font-bold !px-6 !py-4',

      success: {
        iconTheme: { primary: 'var(--color-accent)', secondary: '#fff' },
        className: '!border-r-4 !border-r-accent',
      },
      error: {
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
        className: '!border-r-4 !border-r-red-500',
      },
      loading: {
        iconTheme: { primary: 'var(--color-primary)', secondary: '#fff' },
        className: '!border-r-4 !border-r-primary',
      },
    }),
  ],
};
