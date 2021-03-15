import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/statistics/statistic.component';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent],
    imports: [CommonModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe]
})
export class ConfusionMatrixModule { }
