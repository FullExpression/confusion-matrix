import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/metrics/statistics/statistic.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../services/download.service';
import { ImportService } from '../services/import.service';
import { MetricsConfigurationComponent } from '../components/configurations/metrics/metrics.configurations.component';
import { DialogComponent } from '../components/dialogs/dialog.component';
import { MetricComponent } from '../components/metrics/metric/metric.component';
import { MetricConfigurationsComponent } from '../components/metrics/metric/metric-configurations/metric-configurations.component';
import { CustomSelectComponent } from '../components/html-basics/select/custom-select.component';
import { ColorPickerComponent } from '../components/html-basics/color-picker/color-picker.component';
import { InputTextComponent } from '../components/html-basics/inputs/input-text/input-text.component';
import { InputNumberComponent } from '../components/html-basics/inputs/input-number/input-number.component';
import { CustomInputComponent } from '../components/html-basics/inputs/custom-input/custom-input.component';
import { MetricService } from '../components/metrics/metric/metric.service';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent,
        ConfigurationsComponent, MetricsConfigurationComponent,
        DialogComponent, MetricComponent, MetricConfigurationsComponent,
        CustomSelectComponent, ColorPickerComponent, InputTextComponent,
        InputNumberComponent, CustomInputComponent],
    imports: [CommonModule, FormsModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe, DownloadService, ImportService, MetricService]
})
export class ConfusionMatrixModule { }
