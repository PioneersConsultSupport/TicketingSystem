//import { HttpInterceptor, HttpClient, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
//import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs';
//import { environment } from '../environments/environment';

//@Injectable({
//  providedIn: 'root'
//})
//export class HttpInterceptorService implements HttpInterceptor {
//  constructor(private http: HttpClient) { }

//  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//    debugger
//    if (req.url.includes("/assets/i18n")) {
//      return next.handle(req);
//    }

//    //this.spinnerService.show();
//    const apiReq = req.clone({ url: `${environment.apiUrl}/${req.url}` });
//    return next.handle(apiReq)
//  }
//}
