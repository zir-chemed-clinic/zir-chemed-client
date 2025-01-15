import { TestBed } from '@angular/core/testing';

import { IuiService } from './iui.service';

describe('IuiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IuiService = TestBed.get(IuiService);
    expect(service).toBeTruthy();
  });
});
