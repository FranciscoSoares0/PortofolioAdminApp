import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = inject(TokenService)
    
    if (!token.has() || !token.isValid()) {
        router.navigate(['/auth/login']);
        return false;
    }

    return true;
};
