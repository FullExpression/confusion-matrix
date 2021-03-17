import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss'],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ opacity: 0 }),
                        animate('0.3s ease',
                            style({ opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ opacity: 1 }),
                        animate('0.3s ease',
                            style({ opacity: 0 }))
                    ]
                )
            ]
        )
    ]

})
export class ConfigurationsComponent {
    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    changeVisibility(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(this.visible);
    }
}