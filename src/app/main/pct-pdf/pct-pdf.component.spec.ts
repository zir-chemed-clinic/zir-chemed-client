import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PctPdfComponent } from './pct-pdf.component';

describe('PctPdfComponent', () => {
  let component: PctPdfComponent;
  let fixture: ComponentFixture<PctPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PctPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PctPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
