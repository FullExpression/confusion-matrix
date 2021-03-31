import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DialogConfiguration } from "./dialog.component.model";

@Component({
    selector: 'cm-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
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
export class DialogComponent {

    @Input()
    configuration = new DialogConfiguration();

    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    changeVisibility(value: boolean) {
        if (this.configuration.closeButton.closeOnClick) {
            this.visible = value;
        }

        this.visibleChange.emit(this.visible);
    }

}