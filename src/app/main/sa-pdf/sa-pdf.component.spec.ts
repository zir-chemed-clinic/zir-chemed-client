import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaPdfComponent } from './sa-pdf.component';

describe('SaPdfComponent', () => {
  let component: SaPdfComponent;
  let fixture: ComponentFixture<SaPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
