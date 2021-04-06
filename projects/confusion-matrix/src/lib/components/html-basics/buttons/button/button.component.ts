import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'custom-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input()
    text = '';

    @Input()
    backgroundColor = "#9e9e9e";

    @Input()
    fontColor = 'white';

    @Output() click = new EventEmitter<void>();
}