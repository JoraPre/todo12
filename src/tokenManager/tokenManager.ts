export class TokenManager {
  private _refreshToken: string | null = null;
  private _accessToken: string | null = null;

  constructor() {
    const savedRefresh = localStorage.getItem("refreshToken");
    if (savedRefresh) {
      this._refreshToken = savedRefresh;
    }
  }

  setAccessToken(token: string): void {
    this._accessToken = token;
  }

  getAccessToken(): string | null {
    return this._accessToken;
  }

  setRefreshToken(token: string): void {
    this._refreshToken = token;
    localStorage.setItem("refreshToken", token);
  }

  getRefreshToken(): string | null {
    return this._refreshToken;
  }

  removeTokens(): void {
    this._accessToken = null;
    this._refreshToken = null;
    localStorage.removeItem("refreshToken");
  }
}

export const tokenManager = new TokenManager();
