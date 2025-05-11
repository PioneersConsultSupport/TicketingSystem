import { Component, OnInit } from '@angular/core';
import { Activity, activities } from './activity-timeline-data';
import { NgFor, NgIf } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DemoMaterialModule } from '../../../demo-material-module';

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [DemoMaterialModule, NgIf, NgFor, TranslatePipe],
  templateUrl: './activity-timeline.component.html'
})
export class ActivityTimelineComponent implements OnInit {

  activityData: Activity[];

  constructor() {

    this.activityData = activities;
  }


  ngOnInit(): void {
  }

}
