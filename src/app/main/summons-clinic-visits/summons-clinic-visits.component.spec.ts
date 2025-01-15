import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummonsClinicVisitsComponent } from './summons-clinic-visits.component';

describe('SummonsClinicVisitsComponent', () => {
  let component: SummonsClinicVisitsComponent;
  let fixture: ComponentFixture<SummonsClinicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummonsClinicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonsClinicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
