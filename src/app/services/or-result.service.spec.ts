import { TestBed, inject } from '@angular/core/testing';

import { OrResultService } from './or-result.service';

describe('OrResultService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrResultService]
    });
  });

  it('should be created', inject([OrResultService], (service: OrResultService) => {
    expect(service).toBeTruthy();
  }));
});
