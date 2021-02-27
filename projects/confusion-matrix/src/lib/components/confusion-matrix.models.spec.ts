import { ConfusionMatrix } from "./confusion-matrix.models";

describe("Confusion matrix model test suite", () => {

    const getLabels = () => {
        return ["Apple", "Orange", "Mango"];
    }

    const getMatrix = () => {
        return [[7, 8, 10],
        [1, 2, 3],
        [3, 2, 0]];
    }

    const getConfusionMatrix = () => {
        return new ConfusionMatrix({
            labels: getLabels(),
            matrix: getMatrix()
        });
    }

    const getTrueClasses = () => {
        return {
            Apple: {
                truePositive: 7,
                trueNegative: 2 + 3 + 2 + 0,
                falsePositive: 8 + 10,
                falseNegative: 1 + 3
            },
            Orange: {
                truePositive: 2,
                trueNegative: 7 + 3 + 10 + 0,
                falsePositive: 1 + 3,
                falseNegative: 8 + 2
            },
            Mango: {
                truePositive: 0,
                trueNegative: 7 + 8 + 1 + 2,
                falsePositive: 2 + 3,
                falseNegative: 10 + 3
            }
        }
    }

    it("Can initialize correctly.", () => {
        const confusionMatrix = getConfusionMatrix();
        expect(confusionMatrix.labels).toEqual(getLabels());
        expect(confusionMatrix.matrix).toEqual(getMatrix());
    });

    it("Should set confusion matrix from another confusion matrix.", () => {
        const confusionMatrix = getConfusionMatrix();
        const labels = ['Joy', 'Euphoria'];
        const matrix = [[10, 20], [30, 40]]
        const anotherConfusionMatrix = new ConfusionMatrix({
            labels, matrix
        });
        confusionMatrix.setConfusionMatrix(anotherConfusionMatrix);
        expect(confusionMatrix.labels).toEqual(labels);
        expect(confusionMatrix.matrix).toEqual(matrix);
    });

    it("Should set/get labels and matrix", () => {
        const confusionMatrix = new ConfusionMatrix()
        const labels = ['Joy', 'Euphoria'];
        const matrix = [[10, 20], [30, 40]]
        confusionMatrix.labels = labels;
        confusionMatrix.matrix = matrix;
        expect(confusionMatrix.labels).toEqual(labels);
        expect(confusionMatrix.matrix).toEqual(matrix);
    });

    it("Should normalize a matrix", () => {
        let confusionMatrix = getConfusionMatrix();
        confusionMatrix.normalize(0, 1);
        expect(confusionMatrix.matrix).toEqual([[0.7, 0.8, 1],
        [0.1, 0.2, 0.3],
        [0.3, 0.2, 0]]
        );

        confusionMatrix = getConfusionMatrix();
        confusionMatrix.normalize(1, 2);
        expect(confusionMatrix.matrix).toEqual([[1.7, 1.8, 2],
        [1.1, 1.2, 1.3],
        [1.3, 1.2, 1]]
        );

        confusionMatrix = getConfusionMatrix();
        confusionMatrix.normalize(-1, 0, 1);
        expect(confusionMatrix.matrix).toEqual([[-0.3, -0.2, 0],
        [-0.9, -0.8, -0.7],
        [-0.7, -0.8, -1]]
        );

        confusionMatrix = getConfusionMatrix();
        confusionMatrix.normalize(-13.726, 89.93214, 5);
        expect(confusionMatrix.matrix).toEqual([[58.8347, 69.20051, 89.93214],
        [-3.36019, 7.00563, 17.37144],
        [17.37144, 7.00563, -13.726]]
        );

        confusionMatrix.normalize(-13.726, 89.93214, 5);

        expect(() => confusionMatrix.normalize(3, 3))
            .toThrow("Min value cannot be equal or greater than max value.");

        expect(() => confusionMatrix.normalize(4, 3))
            .toThrow("Min value cannot be equal or greater than max value.");

        expect(() => confusionMatrix.normalize(-1, -3))
            .toThrow("Min value cannot be equal or greater than max value.");
    });

    it("Can validate confusion matrix on initialization correctly.", () => {
        // let confusionMatrix = new ConfusionMatrix()
        // expect(confusionMatrix.labels).toEqual(getLabels());
        // expect(confusionMatrix.matrix).toEqual(getMatrix());
    });


    it("Can validate labels format correctly.", () => {
        let confusionMatrix = getConfusionMatrix();
        expect(confusionMatrix.labels).toEqual(getLabels());
        expect(confusionMatrix.matrix).toEqual(getMatrix());
        expect(confusionMatrix.labels.length).toBe(getMatrix().length);
    });

    it("Can get true classes.", () => {
        const confusionMatrix = getConfusionMatrix();
        const { Apple, Orange, Mango } = getTrueClasses();

        const appleTrueClass = confusionMatrix.getTrueClasses('Apple');
        const orangeTrueClass = confusionMatrix.getTrueClasses('Orange');
        const mangoTrueClass = confusionMatrix.getTrueClasses('Mango');

        expect(appleTrueClass).toEqual(Apple);
        expect(orangeTrueClass).toEqual(Orange);
        expect(mangoTrueClass).toEqual(Mango);

    });

    it("Can get all true classes.", () => {
        const confusionMatrix = getConfusionMatrix();
        const { Apple, Orange, Mango } = getTrueClasses();

        const allTrueClasses = confusionMatrix.getAllTrueClasses();

        expect(allTrueClasses[0].trueClasses).toEqual(Apple);
        expect(allTrueClasses[1].trueClasses).toEqual(Orange);
        expect(allTrueClasses[2].trueClasses).toEqual(Mango);

    });

});