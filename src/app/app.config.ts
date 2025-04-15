import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptorInterceptor } from './auth/interceptors/base-url-interceptor.interceptor';
import { tokenInterceptor } from './auth/interceptors/token.interceptor';
import { unauthorizedInterceptor } from './auth/interceptors/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        baseUrlInterceptorInterceptor,
        tokenInterceptor,
        unauthorizedInterceptor,
      ])
    ),
  ],
};
