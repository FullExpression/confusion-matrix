import { TestBed } from '@angular/core/testing';

import { FullExpressionConfusionMatrixService } from './fullexpressionconfusionmatrix.service';

describe('FullExpressionConfusionMatrixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FullExpressionConfusionMatrixService = TestBed.get(FullExpressionConfusionMatrixService);
    expect(service).toBeTruthy();
  });
});
