import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth-response';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly token = inject(TokenService);
  private readonly router = inject(Router);


  login(email: string, password: string) {
    return this.http.post<AuthResponse>('/auth/login', { email, password });
  }

  logout() {
    this.token.remove();
    this.router.navigate(['/auth/login']);
  }

}
