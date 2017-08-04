import { TestBed, inject } from '@angular/core/testing';

import { DemandService } from './demand.service';

describe('DemandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemandService]
    });
  });

  it('should be created', inject([DemandService], (service: DemandService) => {
    expect(service).toBeTruthy();
  }));
});
