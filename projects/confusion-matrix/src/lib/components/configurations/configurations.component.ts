import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfigurationsOption } from "./configurations.component.model";

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

    @Input()
    option = ConfigurationsOption.None;

    @Output()
    optionChange = new EventEmitter<ConfigurationsOption>();

    get configurationsOptions(): typeof ConfigurationsOption {
        return ConfigurationsOption;
    }

    changeVisibility(value: boolean) {
        this.visible = value;
        this.visibleChange.emit(this.visible);
    }

    changeOptions(value: ConfigurationsOption) {
        this.option = value;
        this.optionChange.emit(this.option);
    }


}