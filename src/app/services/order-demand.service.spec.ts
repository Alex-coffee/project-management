import { TestBed, inject } from '@angular/core/testing';

import { OrderDemandService } from './order-demand.service';

describe('OrderDemandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderDemandService]
    });
  });

  it('should be created', inject([OrderDemandService], (service: OrderDemandService) => {
    expect(service).toBeTruthy();
  }));
});
