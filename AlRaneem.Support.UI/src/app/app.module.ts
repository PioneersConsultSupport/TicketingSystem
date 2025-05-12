
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserModule } from './user/user.module';
import { HttpInterceptorService } from './services/httpInterceptorService';
import { BidiModule, Directionality } from '@angular/cdk/bidi';
//import { } from '@azure'
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 ||
             window.navigator.userAgent.indexOf('Trident/') > -1;
@NgModule({
  declarations: [
    AppComponent,
    FullComponent,

    SpinnerComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    UserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AppSidebarComponent,
    ReactiveFormsModule,
    BidiModule,
    AppHeaderComponent,
    MsalModule.forRoot(new PublicClientApplication(
      {
        auth: {
          clientId: '164f37a5-94d6-4943-a1a4-1622f90276b0',
          redirectUri: 'http://localhost:4200',
          authority: 'https://login.microsoftonline.com/4b8957b1-49be-40b7-9537-63e78101460d'
        },
        cache: {
          cacheLocation: 'localStorage',
          storeAuthStateInCookie: isIE
        }
      }
    ), {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes:['api://fa035b9e-666c-4a68-99fe-eb806283d482/access_as_user']
      }
    }, {
      interactionType: InteractionType.Redirect,
      protectedResourceMap: new Map(
        [
          ['https://localhost:7046/',['api://fa035b9e-666c-4a68-99fe-eb806283d482/access_as_user']]
        ]
      )
    })

  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    //{
    //  provide: HTTP_INTERCEPTORS,
    //  useClass: HttpInterceptorService,
    //  multi: true
    //},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService, 
    MsalBroadcastService,
    MsalGuard
    //{ provide: Directionality, useFactory: () => ({ value: 'ltr' }) }
    //{ provide: Directionality, useValue: { value: lang === 'ar' ? 'rtl' : 'ltr' } } 
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
