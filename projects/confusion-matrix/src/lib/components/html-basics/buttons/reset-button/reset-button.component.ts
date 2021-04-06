import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'reset-button',
    templateUrl: './reset-button.component.html',
    styleUrls: ['./reset-button.component.scss']
})
export class ResetButtonComponent {
    @Output() click = new EventEmitter<void>();
}