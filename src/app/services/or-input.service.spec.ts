import { TestBed, inject } from '@angular/core/testing';

import { OrInputService } from './or-input.service';

describe('OrInputService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrInputService]
    });
  });

  it('should be created', inject([OrInputService], (service: OrInputService) => {
    expect(service).toBeTruthy();
  }));
});
