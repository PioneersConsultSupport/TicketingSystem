import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './authService';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private http: HttpClient, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("/assets/i18n")) {
      return next.handle(req);
    }
    const apiReq = req.clone({ url: `${environment.apiUrl}/${req.url}` });
    // Check if the request URL should bypass the token logic
    if (this.isExcludedUrl(apiReq.url)) {
      return next.handle(apiReq); // Bypass token logic and proceed with the request
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      if (this.isTokenExpired())
      {
        // Wait for the token to be refreshed, then handle the request
        return this.handleTokenRefresh(apiReq, next);
      }
      else
      {
        // Clone and handle the request with the existing token
        const cloned = apiReq.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(cloned);
      }
    } else {
      // No token, just proceed with the request
      return next.handle(apiReq);
    }
  }

  // Method to check if a request should bypass the token logic
  private isExcludedUrl(url: string): boolean {
    const excludedUrls = [
      '/login', // Example of a login request
      '/refresh', // Example of token refresh endpoint
      '/register', // Example of a public endpoint
      // Add more URLs or patterns as needed
    ];

    return excludedUrls.some(excludedUrl => url.includes(excludedUrl));
  }

  isTokenExpired(): boolean {
    const tokenExpiryTime = localStorage.getItem('tokenExpiryTime');
    if (tokenExpiryTime) {
      const expiryTime = parseInt(tokenExpiryTime, 10);
      const currentTime = Date.now();
      return currentTime > expiryTime; // True if the token is expired
    }
    return false;
  }

  handleTokenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>('refresh', { refreshToken: refreshToken })
      .pipe(
        switchMap((response: any) => {
          if (response.IsSuccess) {
            // Store the new tokens
            localStorage.setItem('accessToken', response.Data.accessToken);
            localStorage.setItem('refreshToken', response.Data.refreshToken);
            const tokenExpiryTime = Date.now() + response.Data.expiresIn * 1000;
            localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());

            // Clone the original request with the new token
            const cloned = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.Data.accessToken}`
              }
            });
            // Handle the original request with the new token
            return next.handle(cloned);
          }
          else
          {
            // Handle failure to refresh token
            return throwError('Failed to refresh token');
          }
        }),
        catchError((error) => {
          // Handle error during token refresh
          if (error.status == 401) {
            this.authService.logout();
          }
          return throwError(error);
        })
      );
  }
}
