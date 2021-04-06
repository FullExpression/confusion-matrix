import { animate, style, transition, trigger } from "@angular/animations";
import { Component, ComponentFactoryResolver, EventEmitter, Input, Output, ViewChildren, ViewContainerRef } from "@angular/core";
import { ConfusionMatrix } from "@fullexpression/confusion-matrix-stats";

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

    remove(position: number) {
        this.metrics.splice(position, 1);
    }
}