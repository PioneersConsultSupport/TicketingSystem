import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventType } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Pioneers Consulting';

  constructor(
    private router: Router,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$.subscribe((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const authResult = event.payload as AuthenticationResult;
        this.msalService.instance.setActiveAccount(authResult.account);
      }
    });

    // Optional: handle redirect or popup already finished login
    const account = this.msalService.instance.getAllAccounts()[0];
    if (account && !this.msalService.instance.getActiveAccount()) {
      this.msalService.instance.setActiveAccount(account);
    }
  }
}
