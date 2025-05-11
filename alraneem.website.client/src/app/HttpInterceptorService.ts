//import { Injectable } from '@angular/core';
//import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
//import { Observable, throwError } from 'rxjs';
//import { catchError, finalize, switchMap } from 'rxjs/operators';
////import { AuthService } from './authService';
///*import { SpinnerService } from './spinner.service';*/
//import { environment } from './environments/environment';

//@Injectable()
//export class HttpInterceptorService implements HttpInterceptor {
//  constructor(private http: HttpClient) { }

//  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//    if (req.url.includes("/assets/i18n")) {
//      return next.handle(req);
//    }

//    //this.spinnerService.show();
//    const apiReq = req.clone({ url: `${environment.apiUrl}/${req.url}` });
//    debugger
//    return next.handle(apiReq)
//  }
//}
