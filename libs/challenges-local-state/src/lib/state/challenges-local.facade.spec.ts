import { TestBed } from '@angular/core/testing';

import { ChallengesLocalFacade } from './challenges-local.facade';

describe('ChallengesService', () => {
  let service: ChallengesLocalFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChallengesLocalFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
