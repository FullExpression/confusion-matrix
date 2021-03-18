import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/statistics/statistic.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent, ConfigurationsComponent],
    imports: [CommonModule, FormsModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe]
})
export class ConfusionMatrixModule { }
