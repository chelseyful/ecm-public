import { TestBed } from '@angular/core/testing';

import { ExtraCreditCodeService } from './extra-credit-code.service';

describe('ExtraCreditCodeService', () => {
  let service: ExtraCreditCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtraCreditCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
