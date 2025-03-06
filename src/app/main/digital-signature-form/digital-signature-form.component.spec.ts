import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignatureFormComponent } from './digital-signature-form.component';

describe('DigitalSignatureFormComponent', () => {
  let component: DigitalSignatureFormComponent;
  let fixture: ComponentFixture<DigitalSignatureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSignatureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSignatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
