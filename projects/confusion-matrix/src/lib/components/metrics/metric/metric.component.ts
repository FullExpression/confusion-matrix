import { DecimalPipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { MetricsEnum } from "../../configurations/metrics/metrics.configurations.model";
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

    configurationsVisible = false;

    get value(): number {
        return this.metricService.calculate(
            this.confusionMatrix,
            this.metric,
            this.averageMethod,
            this.label
        )
    };

    @Input() round?: number;

    @Input()
    style = new MetricStyleConfiguration();

    get metricsTags(): Array<MetricTag> {
        const labels = [this.metricLabel, this.averageLabel]
        if (this.label) {
            labels.push(new MetricTag({
                backgroundColor: 'black',
                fontColor: 'white',
                text: this.label
            }));
        }
        return labels;
    }

    private metricLabel = new MetricTag({
        backgroundColor: '#ff9800',
        fontColor: 'white',
        text: MetricsEnum[this.metric as keyof typeof MetricsEnum]
    });

    private averageLabel = new MetricTag({
        backgroundColor: '#2196f3',
        fontColor: 'white',
        text: this.getAverageText(this.averageMethod)
    });

    constructor(private metricService: MetricService, private decimalPipe: DecimalPipe) { }


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


}