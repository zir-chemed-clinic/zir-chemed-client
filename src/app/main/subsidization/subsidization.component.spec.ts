import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidizationComponent } from './subsidization.component';

describe('SubsidizationComponent', () => {
  let component: SubsidizationComponent;
  let fixture: ComponentFixture<SubsidizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
