import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AverageMethod } from "@fullexpression/confusion-matrix-stats";
import { MetricsConfiguration, MetricsEnum } from "./metrics.configurations.model";

@Component({
    selector: 'metrics-configurations',
    templateUrl: './metrics.configurations.component.html',
    styleUrls: ['./metrics.configurations.component.scss'],

})
export class MetricsConfigurationComponent {

    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    metrics = new Array<string>();
    methods = new Array<string>();

    selectedMetrics = new Array<MetricsConfiguration>();

    selectedMetric: MetricsEnum | undefined;

    selectedAverageMethod: AverageMethod | undefined;

    constructor() {
        for (let enumMember in MetricsEnum) {
            this.metrics.push(enumMember);
        }

        for (let averageMethod in AverageMethod) {
            this.methods.push(averageMethod);
        }
    }

    add() {
        if (this.selectedMetric && this.selectedAverageMethod) {
            this.selectedMetrics.push({
                metric: this.selectedMetric,
                averageMethod: this.selectedAverageMethod
            });
        }
    }

    remove(index: number) {
        this.selectedMetrics.splice(index, 1);
    }
}