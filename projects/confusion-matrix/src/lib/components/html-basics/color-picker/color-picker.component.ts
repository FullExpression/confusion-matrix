import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
    @Input()
    color: string | undefined;

    @Output()
    colorChange = new EventEmitter<string>();

    @ViewChild('input')
    input: ElementRef<HTMLInputElement> | undefined;

    openColorPicker() {
        this.input?.nativeElement.click();
    }

    colorChanged(event: any) {
        this.color = this.input?.nativeElement.value;
        this.colorChange.emit(this.input?.nativeElement.value);
    }
}