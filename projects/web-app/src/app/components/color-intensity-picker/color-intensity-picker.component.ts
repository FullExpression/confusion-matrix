import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'color-intensity-picker',
    styleUrls: ['./color-intensity-picker.component.scss'],
    templateUrl: 'color-intensity-picker.component.html'
})

export class ColorIntensityPicker {

    @Input()
    colors = new Array<string>();

    @Output()
    colorsChange = new EventEmitter<Array<string>>();

    addColor() {
        this.colors.push('');
    }
}