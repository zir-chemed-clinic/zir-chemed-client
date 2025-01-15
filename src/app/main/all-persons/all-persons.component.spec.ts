import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPersonsComponent } from './all-persons.component';

describe('AllPersonsComponent', () => {
  let component: AllPersonsComponent;
  let fixture: ComponentFixture<AllPersonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllPersonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPersonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
