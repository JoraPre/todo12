export class TokenManager {
  private _refreshToken: string = "";
  private _accessToken: string = "";

  constructor() {
    const savedRefresh = localStorage.getItem("refreshToken");
    if (savedRefresh) {
      this._refreshToken = savedRefresh;
    }
  }

  setAccessToken(token: string) {
    this._accessToken = token;
  }

  getAccessToken() {
    return this._accessToken;
  }

  setRefreshToken(token: string) {
    this._refreshToken = token;
    localStorage.setItem("refreshToken", token);
  }

  getRefreshToken() {
    return this._refreshToken;
  }

  removeTokens() {
    this._accessToken = "";
    this._refreshToken = "";
    localStorage.removeItem("refreshToken");
  }
}

export const tokenManager = new TokenManager();
