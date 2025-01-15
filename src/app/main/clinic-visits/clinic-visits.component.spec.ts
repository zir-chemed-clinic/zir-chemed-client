import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicVisitsComponent } from './clinic-visits.component';

describe('ClinicVisitsComponent', () => {
  let component: ClinicVisitsComponent;
  let fixture: ComponentFixture<ClinicVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
