import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { AverageMethod } from "@fullexpression/confusion-matrix-stats";
import { MetricsEnum } from "../../metrics.configurations.model";
import { CustomSelectValue } from "../../../html-basics/select/custom-select.models";
import { MetricStyleConfiguration, MetricTag } from "../metric.models";
import { MetricService } from "../metric.service";

@Component({
    selector: 'metric-configurations',
    templateUrl: './metric-configurations.component.html',
    styleUrls: ['./metric-configurations.component.scss']
})
export class MetricConfigurationsComponent {

    @Input()
    visible = false;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    @Input()
    round?= 0;

    @Output()
    roundChange = new EventEmitter<number>();

    @Input()
    style = new MetricStyleConfiguration();

    @Output()
    styleChange = new EventEmitter<MetricStyleConfiguration>();

    @Input()
    metricsTags = new Array<MetricTag>();

    @Output()
    metricsTagsChanged = new EventEmitter<Array<MetricTag>>();

    @Input()
    set labels(labels: Array<string>) {
        this._labels = labels.map((label) => {
            return {
                id: label,
                text: label
            }
        });
        this._labels = [({
            id: 'All',
            text: 'All'
        }), ...this._labels];
    }

    @Input()
    set label(label: string | undefined) {
        if (label) {
            this._label = {
                id: label,
                text: label
            }
        } else {
            this._label = {
                id: 'All',
                text: 'All'
            }
        }
    }

    @Output()
    labelChange = new EventEmitter<string | undefined>();


    @Input()
    set metric(metric: MetricsEnum) {
        if (metric) {
            this._metric = {
                id: metric,
                text: MetricsEnum[metric as keyof typeof MetricsEnum]
            }
        }
    }

    @Output()
    metricChange = new EventEmitter<MetricsEnum>();

    @Input()
    set average(average: AverageMethod) {
        if (average) {
            this._average = {
                id: this.getAverageText(average),
                text: this.getAverageText(average)
            }
        }
    }

    @Output()
    averageChange = new EventEmitter<AverageMethod>();


    metrics = new Array<CustomSelectValue>();
    methods = new Array<CustomSelectValue>();

    get _borderStyle(): CustomSelectValue {
        return { id: this.style.border, text: this.getBorderStyleText(this.style.border) };

    }

    borderStyles: Array<CustomSelectValue>
        = [
            { id: 'SlightRound', text: 'SlightRound' },
            { id: 'Round', text: 'Round' },
            { id: 'Square', text: 'Square' }
        ];
    _label: CustomSelectValue = { id: 'All', text: 'All' };
    _labels = new Array<CustomSelectValue>();

    _metric: CustomSelectValue | undefined;
    _average: CustomSelectValue | undefined;

    constructor(private metricService: MetricService) {
        for (let enumMember in MetricsEnum) {
            this.metrics.push({
                id: enumMember,
                text: MetricsEnum[enumMember as keyof typeof MetricsEnum]
            });
        }


        for (let averageMethod in AverageMethod) {
            const isValueProperty = parseInt(averageMethod, 10) >= 0;
            if (!isValueProperty) {
                this.methods.push({
                    id: averageMethod,
                    text: averageMethod
                });
            }
        }

    }

    metricSelectedChanged(value: CustomSelectValue | undefined) {

        const metric = this.metricService.getMetricEnum(value?.text);
        if (metric) {
            this.metricChange.emit(metric as MetricsEnum);
        }

    }

    averageSelectedChanged(value: CustomSelectValue | undefined) {
        const average = AverageMethod[value?.id as keyof typeof AverageMethod];
        this.averageChange.emit(average);
    }

    labelChanged(value: CustomSelectValue | undefined) {
        if (value) {
            if (value.text == 'All') {
                this.labelChange.emit(undefined);
            } else {
                this.labelChange.emit(value.text);
            }
        }
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

    getBorderStyleText(border: 'SlightRound' | 'Round' | 'Square'): string {
        switch (border) {
            case 'SlightRound':
                return 'Slight Round';
        }
        return border;
    }


    roundChanged(round: number) {
        this.round = round;
        this.roundChange.emit(round);
    }

    borderStyleChanged(value: CustomSelectValue | undefined) {
        if (value) {
            this.style.border = value.id as 'SlightRound' | 'Round' | 'Square';
            this.styleChange.emit(this.style);
        }

    }


}