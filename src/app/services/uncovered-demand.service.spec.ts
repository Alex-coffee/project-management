import { TestBed, inject } from '@angular/core/testing';

import { UncoveredDemandService } from './uncovered-demand.service';

describe('UncoveredDemandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UncoveredDemandService]
    });
  });

  it('should be created', inject([UncoveredDemandService], (service: UncoveredDemandService) => {
    expect(service).toBeTruthy();
  }));
});
