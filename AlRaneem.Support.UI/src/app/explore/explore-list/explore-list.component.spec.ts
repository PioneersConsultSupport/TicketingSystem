import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreListComponent } from './explore-list.component';

describe('CourseListComponent', () => {
  let component: ExploreListComponent;
  let fixture: ComponentFixture<ExploreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExploreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
