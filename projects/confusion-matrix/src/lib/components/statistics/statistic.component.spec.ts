import { StatisticComponent } from "./statistic.component";

describe("Statistic component test suite", () => {
    it("Can initialize correctly.", () => {
        const statisticComponent = new StatisticComponent();
        expect(statisticComponent).toBeDefined(statisticComponent);
    });
});