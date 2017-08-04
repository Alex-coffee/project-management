import { TestBed, inject } from '@angular/core/testing';

import { ItemBOMService } from './item-bom.service';

describe('ItemBOMService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemBOMService]
    });
  });

  it('should be created', inject([ItemBOMService], (service: ItemBOMService) => {
    expect(service).toBeTruthy();
  }));
});
