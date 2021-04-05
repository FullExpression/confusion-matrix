import { Component, Input } from "@angular/core";

@Component({
    selector: 'toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent {
    @Input()
    on = false;
}