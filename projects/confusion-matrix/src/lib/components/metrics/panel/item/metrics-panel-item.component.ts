import { AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from "@angular/core";
import { AverageMethod, ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { MetricComponent } from "../../metric/metric.component";
import { MetricStyleConfiguration } from "../../metric/metric.models";
import { MetricsEnum } from "../../metrics.configurations.model";

@Component({
    selector: 'panel-item',
    templateUrl: './metrics-panel-item.component.html',
    styleUrls: ['./metrics-panel-item.component.scss']
})
export class MetricsPanelItem implements AfterViewInit {

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
    style?= new MetricStyleConfiguration();

    @Output()
    remove = new EventEmitter<void>();

    @ViewChild('container', { read: ViewContainerRef })
    container: ViewContainerRef | undefined;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    ngAfterViewInit(): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MetricComponent);
        const viewContainerRef = this.container;
        const componentRef = viewContainerRef?.createComponent(componentFactory);
        const instance = componentRef?.instance;

        if (instance) {

            instance.confusionMatrix = this.confusionMatrix;
            instance.metric = this.metric;

            instance.averageMethod = this.averageMethod;
            instance.label = this.label;
            instance.round = this.round;
            instance.style = this.style || new MetricStyleConfiguration();
            instance.remove.subscribe(() => this.remove.emit());
            componentRef?.changeDetectorRef.detectChanges();

        }
    }
}