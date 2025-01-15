import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PctComponent } from './pct.component';

describe('PctComponent', () => {
  let component: PctComponent;
  let fixture: ComponentFixture<PctComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PctComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
