import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SolutionComponent } from './components/solution/solution.component';
import { SolutionDetailsComponent } from './components/solution/solution-details/solution-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { FullComponent } from './layout/full/full.component';
import { AdminPanelComponent } from './components/Admin Panel/admin-panel.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { DemoMaterialModule } from './demo-material-module';
import { SharedModule } from './shared/shared.module';
import { AppSidebarComponent } from './layout/full/sidebar/sidebar.component';
import { AppHeaderSupportComponent } from './layout/full/header/header-support.component';
import { TranslatePipe } from './shared/pipes/translate.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { MessageService } from 'primeng/api';
import { SpinnerService } from './services/spinnerService';
import { HttpInterceptorService } from './interceptors/http-interceptor.service';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { environment } from './environments/environment';
import { WrapeComponent } from './components/wrape-component/wrape.component';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

const scope = 'api://' + environment.apiClientId + '/access_as_user';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    SolutionComponent,
    SolutionDetailsComponent,
    TeamsComponent,
    TermsComponent,
    FullComponent,
    WrapeComponent,
    AdminPanelComponent,
    TicketsComponent,
    SpinnerComponent,
    AppHeaderSupportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    SharedModule,
    AppSidebarComponent,
    ToastModule,
    // ✅ Material modules
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MsalModule.forRoot(new PublicClientApplication({
        auth: {
            clientId: environment.clientId,
            redirectUri: environment.redirectUri,
            authority: 'https://login.microsoftonline.com/' + environment.tenantId,
        },
        cache: {
            cacheLocation: 'localStorage',
            storeAuthStateInCookie: isIE,
        },
    }), {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: ['user.read'],
        },
    }, {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([[environment.apiUrl, [scope]]]),
    }),
    TranslatePipe
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
    MessageService,
    SpinnerService],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
