import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService)
  const router = inject(Router)
  const snackBar = inject(MatSnackBar)

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('[INTERCEPTOR]', error.message)

      if (error.status === 401) {

        //try to refresh token
        const refreshToken = tokenService.getRefreshToken();

        if(refreshToken){
          return tokenService.refresh().pipe(
            switchMap((tokens) => {
              // 2. If the refresh was successful, set the new tokens
              tokenService.setTokens(tokens.access_token, tokens.refresh_token);

              // 3. Clone the original request and attach the new access token to it
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.access_token}`,
                },
              });

              // 4. Retry the original request with the new access token
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              // 5. If refreshing the token fails, log the user out and redirect to login
              console.error('[INTERCEPTOR] Refresh failed:', refreshError);
              tokenService.remove();
              router.navigate(['/auth']);
              snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });

              return throwError(refreshError); // Re-throw the refresh error
            })
          );
        }
      }
      else{
        console.log(error)
        snackBar.open(error.error.message, 'Close', { duration: 1000 })
      }

      return throwError(error);
    })
  );
};
