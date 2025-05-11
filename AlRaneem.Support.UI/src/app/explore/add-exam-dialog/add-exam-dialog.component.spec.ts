import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamDialogComponent } from './add-exam-dialog.component';

describe('AddExamDialogComponent', () => {
  let component: AddExamDialogComponent;
  let fixture: ComponentFixture<AddExamDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExamDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddExamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
