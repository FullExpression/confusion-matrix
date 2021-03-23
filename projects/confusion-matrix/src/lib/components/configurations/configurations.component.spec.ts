import { ConfigurationsComponent } from "./configurations.component";

describe("Configurations component test suite", () => {
    it("Can initialize correctly.", () => {
        const confusionMatrix = new ConfigurationsComponent();
        expect(confusionMatrix).toBeDefined();
    });
});