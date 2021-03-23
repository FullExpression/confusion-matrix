import { DecimalPipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfusionMatrixComponent } from "./confusion-matrix.component";

describe("Statistic models test suite", () => {

    let component: ConfusionMatrixComponent;
    let fixture: ComponentFixture<ConfusionMatrixComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ConfusionMatrixComponent],
            providers: [DecimalPipe]
        });
        fixture = TestBed.createComponent(ConfusionMatrixComponent);
        component = fixture.componentInstance;
    });

    it("Can initialize correctly.", () => {
        expect(component).toBeDefined();
    });
});