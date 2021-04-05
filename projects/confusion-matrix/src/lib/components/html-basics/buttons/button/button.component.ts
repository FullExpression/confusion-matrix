import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'custom-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
    @Input()
    text = '';

    @Output() click = new EventEmitter<void>();
}