import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  private http = inject(HttpClient);

  private readonly tokenKey = '@PortofolioAdminApp::Token';
  private readonly refreshTokenKey = '@PortofolioAdminApp::RefreshToken';

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  has() {
    return !!this.getToken();
  }

  isValid() {
    // TODO: decrypt JWT and validate expiration
    return true;
  }

  remove() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  // Request a new access token using the refresh token
  refresh() {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',{"refreshToken":this.getRefreshToken()},
    );
  }
}
