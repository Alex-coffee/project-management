import { TestBed, inject } from '@angular/core/testing';

import { ProductStaticService } from './product-static.service';

describe('ProductStaticService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductStaticService]
    });
  });

  it('should be created', inject([ProductStaticService], (service: ProductStaticService) => {
    expect(service).toBeTruthy();
  }));
});
