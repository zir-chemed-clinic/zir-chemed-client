import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InseminationComponent } from './insemination.component';

describe('InseminationComponent', () => {
  let component: InseminationComponent;
  let fixture: ComponentFixture<InseminationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InseminationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InseminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
