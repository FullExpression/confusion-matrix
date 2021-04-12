import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { UtilService } from "../../../services/util.service";
import { DialogService } from "../../dialogs/dialog.service";
import { MetricsEnum } from "../metrics.configurations.model";
import { MetricConfigurationsComponent } from "./metric-configurations/metric-configurations.component";
import { MetricStyleConfiguration, MetricTag } from "./metric.models";
import { MetricService } from "./metric.service";

@Component({
    selector: 'metric',
    templateUrl: './metric.component.html',
    styleUrls: ['./metric.component.scss']
})
export class MetricComponent {

    @Input()
    confusionMatrix = new ConfusionMatrix();

    @Input()
    metric: MetricsEnum = MetricsEnum.F1Score;

    @Input()
    averageMethod = AverageMethod.Weighted;

    @Input()
    label?: string = undefined;

    @Input() round?: number;

    @Input()
    style = new MetricStyleConfiguration();

    @Output()
    remove = new EventEmitter<void>();

    configurationsVisible = false;

    get value(): number {
        return this.metricService.calculate(
            this.confusionMatrix,
            this.metric,
            this.averageMethod,
            this.label
        )
    };


    get metricsTags(): Array<MetricTag> {
        const labels = [this.metricLabel, this.averageLabel];
        if (this.label) {
            labels.push(new MetricTag({
                backgroundColor: '#3f51b5',
                fontColor: 'white',
                text: this.label
            }));
        }
        return labels;
    }

    private get metricLabel(): MetricTag {
        return new MetricTag({
            backgroundColor: '#ff9800',
            fontColor: 'white',
            text: this.getMetricsText()
        });
    }

    private get averageLabel(): MetricTag {
        return new MetricTag({
            backgroundColor: '#2196f3',
            fontColor: 'white',
            text: this.getAverageText(this.averageMethod)
        });
    }

    constructor(private metricService: MetricService,
        private decimalPipe: DecimalPipe,
        private utilService: UtilService,
        private dialogService: DialogService) { }


    getBorderRadiusStyle(): string {
        switch (this.style.border) {
            case 'Round': return '1000000px';
            case 'SlightRound': return '5px';
            case 'Square': return '0px';
        }
        return '0px';
    }

    metricChanged(event: MetricsEnum) {
        this.metric = event;
        this.metricLabel.text = event;
    }

    averageChanged(event: AverageMethod) {
        this.averageMethod = event;
        this.averageLabel.text = this.getAverageText(event);
    }

    getAverageText(average: AverageMethod): string {
        switch (average) {
            case AverageMethod.Macro:
                return 'Macro';
            case AverageMethod.Micro:
                return 'Micro';
            case AverageMethod.Weighted:
                return 'Weighted';
        }
    }

    getMetricsText(): string {
        return MetricsEnum[this.metric as keyof typeof MetricsEnum];
    }

    getValue(): string {
        let roundString = '';
        if (this.round) {
            roundString = `1.0-${this.round}`;
        } else {
            roundString = `1.0-3`;
        }
        const value = this.decimalPipe.transform(this.value, roundString);
        if (value) {
            return value;
        } else {
            return this.value.toString();
        }
    }

    openConfiguration() {
        const configuration = this.utilService.getComponentReference<MetricConfigurationsComponent>(MetricConfigurationsComponent);
        const instance = configuration.instance;

        instance.visible = this.configurationsVisible;
        instance.visibleChange.subscribe((value: boolean) => this.configurationsVisible = value);

        instance.metricsTags = this.metricsTags;

        instance.style = this.style;
        instance.styleChange.subscribe((value: MetricStyleConfiguration) => this.style = value);

        instance.round = this.round;
        instance.roundChange.subscribe((value: number) => this.round = value);

        instance.metric = this.metric;

        instance.metricChange.subscribe((value: MetricsEnum) => {
            this.metric = value;
            this.metricsTags[0].text = this.metric;
        });

        instance.average = this.averageMethod;
        instance.averageChange.subscribe((value: AverageMethod) => {
            this.averageMethod = value;
            this.metricsTags[1].text = this.getAverageText(this.averageMethod);
        });

        instance.labels = this.confusionMatrix.labels;

        instance.label = this.label;
        instance.labelChange.subscribe((value: string) => this.label = value);

        configuration.changeDetectorRef.detectChanges();
        this.dialogService.show(configuration);
    }

    removeMetric() {
        console.log('asdasdasd');
        this.remove.emit();
    }
}