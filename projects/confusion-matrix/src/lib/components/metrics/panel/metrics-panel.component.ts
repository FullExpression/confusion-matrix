import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { MetricStyleConfiguration } from "../metric/metric.models";
import { MetricsEnum } from "../metrics.configurations.model";

@Component({
    selector: 'metrics-panel',
    templateUrl: './metrics-panel.component.html',
    styleUrls: ['./metrics-panel.component.scss'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ opacity: 0, transform: 'scale(0.8)' }),
                        animate('0.1s',
                            style({ opacity: 1, transform: 'scale(1)' }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ opacity: 1, transform: 'scale(1)' }),
                        animate('0.1s ease',
                            style({ opacity: 0, transform: 'scale(0.8)' }))
                    ]
                )
            ]
        )
    ]
})
export class MetricsPanelComponent implements AfterViewInit {

    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    @Input()
    confusionMatrix = new ConfusionMatrix();

    @ViewChild('container')
    container: ElementRef | undefined;

    metrics: Array<{
        metric: MetricsEnum,
        averageMethod: AverageMethod,
        style?: MetricStyleConfiguration
    }> = [{ metric: MetricsEnum.Accuracy, averageMethod: AverageMethod.Weighted },
    { metric: MetricsEnum.Precision, averageMethod: AverageMethod.Weighted },
    { metric: MetricsEnum.Recall, averageMethod: AverageMethod.Weighted },
    { metric: MetricsEnum.F1Score, averageMethod: AverageMethod.Weighted, style: { backgroundColor: '#ffe8a8', border: 'Round' } }];
    //  { metric: MetricsEnum.Precision, averageMethod: AverageMethod.Weighted },
    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterViewInit(): void {
        // if (this.container) {
        //     this.container.nativeElement.style.transform = 'translate(-50%, -50%)';
        // }

    }

    add() {
        this.metrics.push({
            metric: MetricsEnum.Accuracy,
            averageMethod: AverageMethod.Macro
        });
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    remove(position: number) {
        this.metrics.splice(position, 1);
    }
}