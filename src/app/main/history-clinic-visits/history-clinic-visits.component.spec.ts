import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryClinicVisitsComponent } from './history-clinic-visits.component';

describe('HistoryClinicVisitsComponent', () => {
  let component: HistoryClinicVisitsComponent;
  let fixture: ComponentFixture<HistoryClinicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryClinicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryClinicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
