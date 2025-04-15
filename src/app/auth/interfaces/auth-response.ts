export interface AuthResponse {
    accessToken: string; // The access token for the authenticated user
    refreshToken: string; // The refresh token for the authenticated user
    userId: string; // The ID of the authenticated user
}
