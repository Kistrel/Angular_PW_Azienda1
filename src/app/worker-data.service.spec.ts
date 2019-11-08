import { TestBed } from '@angular/core/testing';

import { WorkerDataService } from './worker-data.service';

describe('WorkerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkerDataService = TestBed.get(WorkerDataService);
    expect(service).toBeTruthy();
  });
});
