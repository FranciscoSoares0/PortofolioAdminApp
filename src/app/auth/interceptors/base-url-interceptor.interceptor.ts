import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

export const baseUrlInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const url = environment.API_BASE_URL.concat(req.url)

  req = req.clone({
    url,
    setHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
  
  return next(req);
};
