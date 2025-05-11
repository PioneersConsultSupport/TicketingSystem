import { Component } from '@angular/core';

@Component({
  selector: 'app-solution',
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent {
  constructor() {
    window.scrollTo(0, 0);
  }
}
