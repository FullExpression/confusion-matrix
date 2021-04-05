import { DecimalPipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DownloadService } from "../services/download.service";
import { ImportService } from "../services/import.service";
import { ConfusionMatrixComponent } from "./confusion-matrix.component";
import { IntensityBarService } from "./intensity-bar/intensity-bar.service";

describe("Statistic models test suite", () => {

    let component: ConfusionMatrixComponent;
    let fixture: ComponentFixture<ConfusionMatrixComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConfusionMatrixComponent],
            providers: [DecimalPipe, DownloadService, ImportService, IntensityBarService]
        });
        fixture = TestBed.createComponent(ConfusionMatrixComponent);
        component = fixture.componentInstance;
    });

    it("Can initialize correctly.", () => {
        expect(component).toBeDefined();
    });
});