import { TestBed, inject } from '@angular/core/testing';

import { PurchasePlanService } from './purchase-plan.service';

describe('PurchasePlanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PurchasePlanService]
    });
  });

  it('should be created', inject([PurchasePlanService], (service: PurchasePlanService) => {
    expect(service).toBeTruthy();
  }));
});
