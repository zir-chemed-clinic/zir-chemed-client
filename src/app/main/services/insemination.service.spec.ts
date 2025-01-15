import { TestBed } from '@angular/core/testing';

import { InseminationService } from './insemination.service';

describe('InseminationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InseminationService = TestBed.get(InseminationService);
    expect(service).toBeTruthy();
  });
});
