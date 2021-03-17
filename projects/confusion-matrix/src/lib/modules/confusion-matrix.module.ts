import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/statistics/statistic.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent, ConfigurationsComponent],
    imports: [CommonModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe]
})
export class ConfusionMatrixModule { }
