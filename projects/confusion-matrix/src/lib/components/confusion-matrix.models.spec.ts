import { ConfusionMatrix } from "./confusion-matrix.models";

describe("Confusion matrix model test suite", () => {

    it("Can initialize correctly.", () => {
        const confusionMatrix = new ConfusionMatrix({
            labels:
                ["Happiness", "Sadness", "Angry", "Neutral"],
            matrix:
                [[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12],
                [13, 14, 15, 16]]
        });
        expect(confusionMatrix.labels).toEqual(["Happiness", "Sadness", "Angry", "Neutral"]);
        expect(confusionMatrix.matrix).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
    });

    it("Number of rows same as number of columns.", () => {
        expect("Not Implemented Yet!").toBeFalsy();
    });

    it("Number of labels equals number of columns.", () => {
        expect("Not Implemented Yet!").toBeFalsy();
    });
});