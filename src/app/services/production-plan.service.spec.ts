import { TestBed, inject } from '@angular/core/testing';

import { ProductionPlanService } from './production-plan.service';

describe('ProductionPlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductionPlanService]
    });
  });

  it('should be created', inject([ProductionPlanService], (service: ProductionPlanService) => {
    expect(service).toBeTruthy();
  }));
});
