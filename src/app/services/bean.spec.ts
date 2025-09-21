import { TestBed } from '@angular/core/testing';

import { Bean } from './bean';

describe('Bean', () => {
  let service: Bean;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bean);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
