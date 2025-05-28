import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinnerService';

@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="spinnerService.loading$ | async" class="overlay">
      <div class="loader"></div>
    </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {}
}