import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/statistics/statistic.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../services/download.service';
import { ImportService } from '../services/import.service';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent, ConfigurationsComponent],
    imports: [CommonModule, FormsModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe, DownloadService, ImportService]
})
export class ConfusionMatrixModule { }
