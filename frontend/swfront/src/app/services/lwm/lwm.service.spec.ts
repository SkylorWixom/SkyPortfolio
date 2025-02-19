import { TestBed } from '@angular/core/testing';

import { LwmService } from './lwm.service';

describe('LwmService', () => {
  let service: LwmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LwmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
