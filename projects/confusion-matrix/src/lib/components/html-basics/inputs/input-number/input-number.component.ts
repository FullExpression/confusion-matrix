import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['input-number.component.scss']
})
export class InputNumberComponent {

    @Input()
    set value(v: number | undefined) {
        this._value = v?.toString();
    }

    @Output()
    valueChange = new EventEmitter<number>();

    @Input()
    min: number | undefined;

    @Input()
    max: number | undefined;

    _value: string | undefined;

    valueChanged(value: string | undefined) {
        this._value = value;
        this.valueChange.emit(Number(this._value));
    }
}