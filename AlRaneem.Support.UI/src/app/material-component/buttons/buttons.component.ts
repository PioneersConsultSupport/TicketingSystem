import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DemoMaterialModule } from '../../demo-material-module';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [DemoMaterialModule, MatButtonModule, TranslatePipe],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent {
  constructor() { }
}
