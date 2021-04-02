import { Component, ComponentFactoryResolver, Input } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";
import { MetricComponent } from "../metric/metric.component";

@Component({
    selector: 'metrics-panel',
    templateUrl: './metrics-panel.component.html',
    styleUrls: ['./metrics-panel.component.scss']
})
export class MetricsPanelComponent {

    @Input()
    confusionMatrix = new ConfusionMatrix();

    metrics = new Array<MetricComponent>();

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    add() {
        const component = this.componentFactoryResolver.resolveComponentFactory(MetricComponent);
    }
}