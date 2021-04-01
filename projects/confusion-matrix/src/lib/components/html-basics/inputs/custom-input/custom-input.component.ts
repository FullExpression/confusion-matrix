import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'custom-input',
    templateUrl: './custom-input.component.html',
    styleUrls: ['custom-input.component.scss']
})
export class CustomInputComponent {

    @Input()
    type = 'text';

    @Input()
    value: string | undefined;

    @Output()
    valueChange = new EventEmitter<string>();

    @Input()
    min: number | undefined;

    @Input()
    max: number | undefined;

    valueChanged(value: any) {
        this.valueChange.emit(value.target.value);
    }

}