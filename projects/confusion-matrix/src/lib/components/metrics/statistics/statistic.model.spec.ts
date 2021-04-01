import { StatisticStyleConfiguration } from "./statistic.model";

describe("Statistic models test suite", () => {
    it("Can initialize correctly.", () => {
        const statisticStyleConfiguration = new StatisticStyleConfiguration();
        expect(statisticStyleConfiguration).toBeDefined();
    });
});