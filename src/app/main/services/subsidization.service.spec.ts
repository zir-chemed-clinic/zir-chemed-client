import { TestBed } from '@angular/core/testing';

import { SubsidizationService } from './subsidization.service';

describe('SubsidizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubsidizationService = TestBed.get(SubsidizationService);
    expect(service).toBeTruthy();
  });
});
