import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'add-button',
    templateUrl: './add-button.component.html',
    styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
    @Output() click = new EventEmitter<void>();
}