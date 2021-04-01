import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'input-text',
    templateUrl: './input-text.component.html',
    styleUrls: ['input-text.component.scss']
})
export class InputTextComponent {
    @Input()
    value: string | undefined;

    @Output()
    valueChange = new EventEmitter<String>();
}