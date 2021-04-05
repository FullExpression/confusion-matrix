import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'remove-button',
    templateUrl: './remove-button.component.html',
    styleUrls: ['./remove-button.component.scss']
})
export class RemoveButtonComponent {
    @Output() click = new EventEmitter<void>();
}