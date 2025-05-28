import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { EMPTY, from, Observable, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { MessageService } from 'primeng/api';
import { SpinnerService } from '../services/spinnerService';
import { environment } from '../environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private msalService: MsalService,
    private messageService: MessageService,
    private spinnerService: SpinnerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount) {
      this.msalService.loginRedirect();
      return EMPTY;
    }

    return from(
      this.msalService.instance.acquireTokenSilent({
        account: activeAccount,
        scopes: ['api://' + environment.apiClientId + '/access_as_user'],
      })
    ).pipe(
      switchMap((result) => {
        const authReq = req.clone({
          url: `${req.url.includes('assets/i18n/') ? '' : environment.apiUrl}/${req.url}`,
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        });
        this.spinnerService.show();
        return next.handle(authReq).pipe(
          tap((event) => {
            if (event instanceof HttpResponse) {
              if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Done Successfully',
                  life: 6000,
                });
              }
            }
          }),
          catchError((error: HttpErrorResponse) => {
            let errorMsg = 'An unknown error occurred';

            if (error.error instanceof ErrorEvent) {
              errorMsg = `Client Error: ${error.error.message}`;
            } else {
              errorMsg = `Error ${error.status}: ${error?.error?.detail}`;

              switch (error.status) {
                case 400:
                  errorMsg = error.error?.message || 'Bad Request';
                  break;
                case 401:
                  errorMsg = 'Unauthorized';
                  this.router.navigate(['/unauthorized']);
                  break;
                case 403:
                  errorMsg = 'Forbidden';
                  this.router.navigate(['/unauthorized']);
                  break;
                case 404:
                  errorMsg = 'Resource not found';
                  this.router.navigate(['/not-found']);
                  break;
                case 500:
                  errorMsg = 'Internal server error';
                  this.router.navigate(['/server-error']);
                  break;
              }
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: errorMsg,
              life: 6000,
            });
            return throwError(() => error);
          }),
          finalize(() => this.spinnerService.hide())
        );
      }),
      catchError((err) => {
        if (err instanceof InteractionRequiredAuthError) {
          this.msalService.logoutRedirect({
            postLogoutRedirectUri: environment.redirectUri,
          });
        }

        return throwError(() => err);
      })
    );
  }
}
