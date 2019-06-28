import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullExpressionConfusionMatrixComponent } from './fullexpressionconfusionmatrix.component';

describe('FullExpressionConfusionMatrixComponent', () => {
  let component: FullExpressionConfusionMatrixComponent;
  let fixture: ComponentFixture<FullExpressionConfusionMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullExpressionConfusionMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullExpressionConfusionMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
