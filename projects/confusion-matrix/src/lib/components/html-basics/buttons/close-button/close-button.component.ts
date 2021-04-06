import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'close-button',
    templateUrl: './close-button.component.html',
    styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent {
    @Output() click = new EventEmitter<void>();
}