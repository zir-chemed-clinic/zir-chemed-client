import { TestBed } from '@angular/core/testing';

import { SaService } from './sa.service';

describe('SaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaService = TestBed.get(SaService);
    expect(service).toBeTruthy();
  });
});
