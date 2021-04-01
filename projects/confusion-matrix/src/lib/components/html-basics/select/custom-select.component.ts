import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomSelectValue } from "./custom-select.models";

@Component({
    selector: 'custom-select',
    templateUrl: './custom-select.component.html',
    styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent {
    @Input()
    values = new Array<CustomSelectValue>();

    @Input()
    selected: CustomSelectValue | undefined;

    @Output()
    selectedChange = new EventEmitter<CustomSelectValue | undefined>();

    selectChanged(event: any) {
        const text = event.target.selectedOptions[0].innerText;
        this.selectedChange.emit({
            id: event.target.selectedOptions[0].value,
            text: text.slice(0, text.length - 1)
        });
    }
}