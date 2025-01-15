import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IuiComponent } from './iui.component';

describe('IuiComponent', () => {
  let component: IuiComponent;
  let fixture: ComponentFixture<IuiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IuiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IuiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
