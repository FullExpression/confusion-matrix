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

    changeColor(color: string, index: number) {
        this.colors[index] = color;
        this.colorsChange.emit(JSON.parse(JSON.stringify(this.colors)));
    }

    addColor() {
        const newColor = Math.floor(Math.random() * 16777215).toString(16);
        this.colors = [...this.colors, `#${newColor}`];
        this.colorsChange.emit(this.colors);
    }

    removeColor(position: number) {
        this.colors.splice(position, 1);
        this.colors = [...this.colors];
        this.colorsChange.emit(this.colors);
    }
}