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
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TeamsComponent } from './components/teams/teams.component';
import { TermsComponent } from './components/terms/terms.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FullComponent } from './layout/full/full.component';
import { AdminPanelComponent } from './components/Admin Panel/admin-panel.component';
import { TicketsComponent } from './tickets/tickets.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { DemoMaterialModule } from './demo-material-module';
import { SharedModule } from './shared/shared.module';
import { RouterModule } from '@angular/router';
import { AppSidebarComponent } from './layout/full/sidebar/sidebar.component';
import { AppHeaderComponent } from './layout/full/header/header.component';
import { TranslatePipe } from './shared/pipes/translate.pipe';

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
    AdminPanelComponent,
    TicketsComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    AppSidebarComponent,
    AppHeaderComponent,
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
