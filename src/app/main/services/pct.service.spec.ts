import { TestBed } from '@angular/core/testing';

import { PctService } from './pct.service';

describe('PctService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PctService = TestBed.get(PctService);
    expect(service).toBeTruthy();
  });
});
