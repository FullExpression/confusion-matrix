import { Component, ComponentFactoryResolver, EventEmitter, Input, Output, ViewChildren, ViewContainerRef } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";

@Component({
    selector: 'metrics-panel',
    templateUrl: './metrics-panel.component.html',
    styleUrls: ['./metrics-panel.component.scss']
})
export class MetricsPanelComponent {

    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    @Input()
    confusionMatrix = new ConfusionMatrix();

    @ViewChildren('dynamic', { read: ViewContainerRef })
    container: ViewContainerRef | undefined;

    metrics = new Array<number>();

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

    add() {
        this.metrics.push(this.metrics.length);
    }

    close() {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}