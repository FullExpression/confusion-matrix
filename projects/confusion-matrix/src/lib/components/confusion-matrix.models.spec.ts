import { ConfusionMatrixSizes } from "./confusion-matrix.models";

describe('Confusion Matrix Models', () => {
    it('Confusion Matrix sizes should exists', () => {
        const small = ConfusionMatrixSizes.Small;
        expect(small).toBe(ConfusionMatrixSizes.Small);
        const large = ConfusionMatrixSizes.Large;
        expect(large).toBe(ConfusionMatrixSizes.Large);
    });
});
