import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
@NgModule({
    declarations: [ConfusionMatrixComponent],
    imports: [CommonModule],
    exports: [ConfusionMatrixComponent],
    providers: [DecimalPipe]
})
export class ConfusionMatrixModule { }
