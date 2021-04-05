import { NgModule } from '@angular/core';
import { ConfusionMatrixComponent } from '../components/confusion-matrix.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { StatisticComponent } from '../components/metrics/statistics/statistic.component';
import { ConfigurationsComponent } from '../components/configurations/configurations.component';
import { FormsModule } from '@angular/forms';
import { DownloadService } from '../services/download.service';
import { ImportService } from '../services/import.service';
import { DialogComponent } from '../components/dialogs/dialog.component';
import { MetricComponent } from '../components/metrics/metric/metric.component';
import { MetricConfigurationsComponent } from '../components/metrics/metric/metric-configurations/metric-configurations.component';
import { CustomSelectComponent } from '../components/html-basics/select/custom-select.component';
import { ColorPickerComponent } from '../components/html-basics/color-picker/color-picker.component';
import { InputTextComponent } from '../components/html-basics/inputs/input-text/input-text.component';
import { InputNumberComponent } from '../components/html-basics/inputs/input-number/input-number.component';
import { CustomInputComponent } from '../components/html-basics/inputs/custom-input/custom-input.component';
import { MetricService } from '../components/metrics/metric/metric.service';
import { MetricsPanelComponent } from '../components/metrics/panel/metrics-panel.component';
import { ToggleComponent } from '../components/html-basics/toggle/toggle.component';
import { MetricsPanelItem } from '../components/metrics/panel/item/metrics-panel-item.component';
import { UtilService } from '../services/util.service';
import { IntensityBarService } from '../components/intensity-bar/intensity-bar.service';
import { IntensityBarComponent } from '../components/intensity-bar/intensity-bar.component';

@NgModule({
    declarations: [ConfusionMatrixComponent, StatisticComponent,
        ConfigurationsComponent,
        DialogComponent, MetricComponent, MetricConfigurationsComponent,
        CustomSelectComponent, ColorPickerComponent, InputTextComponent,
        InputNumberComponent, CustomInputComponent, MetricsPanelComponent,
        ToggleComponent, MetricsPanelItem, IntensityBarComponent],
    imports: [CommonModule, FormsModule],
    exports: [ConfusionMatrixComponent, StatisticComponent],
    providers: [DecimalPipe, DownloadService, ImportService, MetricService, UtilService, IntensityBarService]
})
export class ConfusionMatrixModule { }
