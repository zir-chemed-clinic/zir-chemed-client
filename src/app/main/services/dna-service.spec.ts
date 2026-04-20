import { TestBed } from '@angular/core/testing';

import { DnaService } from './dna-service';

describe('DnaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DnaService = TestBed.get(DnaService);
    expect(service).toBeTruthy();
  });
});