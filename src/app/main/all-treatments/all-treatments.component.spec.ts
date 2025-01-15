import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTreatmentsComponent } from './all-treatments.component';

describe('AllTreatmentsComponent', () => {
  let component: AllTreatmentsComponent;
  let fixture: ComponentFixture<AllTreatmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllTreatmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTreatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
