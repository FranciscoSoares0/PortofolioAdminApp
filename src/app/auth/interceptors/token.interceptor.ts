import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService);

  if (token.has()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.getToken()}`
      }
    })
  }

  return next(req);
};
