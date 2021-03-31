import { animate, style, transition, trigger } from "@angular/animations";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConfigurationsOption } from "./configurations.component.model";

@Component({
    selector: 'configurations',
    templateUrl: './configurations.component.html',
    styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent {
    @Input()
    visible = true;

    @Output()
    visibleChange = new EventEmitter<boolean>();

    @Input()
    option = ConfigurationsOption.None;

    @Output()
    optionChange = new EventEmitter<ConfigurationsOption>();

    @Input()
    editionToggle = false;

    metricsIsVisible = true;

    get configurationsOptions(): typeof ConfigurationsOption {
        return ConfigurationsOption;
    }

    changeEdition() {
        if (this.editionToggle) {
            this.option = ConfigurationsOption.View;
            this.editionToggle = false;
        } else {
            this.option = ConfigurationsOption.Edit;
            this.editionToggle = true;
        }
        this.optionChange.emit(this.option);
    }

    changeOptions(value: ConfigurationsOption) {
        switch (value) {
            case ConfigurationsOption.Metrics:
                this.metricsIsVisible = true;
                break;
            default:
                this.metricsIsVisible = false;
        }
        this.option = value;
        this.optionChange.emit(this.option);
    }


}