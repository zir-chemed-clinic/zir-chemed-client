import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClinicVisitComponent } from './edit-clinic-visit.component';

describe('EditClinicVisitComponent', () => {
  let component: EditClinicVisitComponent;
  let fixture: ComponentFixture<EditClinicVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClinicVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClinicVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
