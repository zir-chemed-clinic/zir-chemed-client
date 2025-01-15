import { TestBed } from '@angular/core/testing';

import { ClinicVisitsService } from './clinic-visits.service';

describe('ClinicVisitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClinicVisitsService = TestBed.get(ClinicVisitsService);
    expect(service).toBeTruthy();
  });
});
