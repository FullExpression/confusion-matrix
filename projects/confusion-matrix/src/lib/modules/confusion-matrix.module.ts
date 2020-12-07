import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [ConfusionMatrixComponent],
    imports: [CommonModule],
    exports: [ConfusionMatrixComponent]
})
export class ConfusionMatrixModule { }
