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

    const getLabelsPredictionsSum = () => {
        return {
            Apple: 7 + 1 + 3,
            Orange: 8 + 2 + 2,
            Mango: 10 + 3 + 0
        }
    };

    const getPredictionsSum = () => {
        const { Apple, Orange, Mango } = getLabelsPredictionsSum();
        return Apple + Orange + Mango;
    }

    const getMatrixClasses = () => {
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
        const { Apple, Orange, Mango } = getMatrixClasses();

        const appleMatrixClass = confusionMatrix.getMatrixClasses('Apple');
        const orangeMatrixClass = confusionMatrix.getMatrixClasses('Orange');
        const mangoMatrixClass = confusionMatrix.getMatrixClasses('Mango');

        expect(appleMatrixClass).toEqual(Apple);
        expect(orangeMatrixClass).toEqual(Orange);
        expect(mangoMatrixClass).toEqual(Mango);

        expect(() => confusionMatrix.getMatrixClasses(''))
            .toThrow(new Error('A valid label should be passed.'));

        expect(() => confusionMatrix.getMatrixClasses('abc'))
            .toThrow(new Error('The label does not exists in the matrix.'));

    });

    it("Can get all true classes.", () => {
        const confusionMatrix = getConfusionMatrix();
        const { Apple, Orange, Mango } = getMatrixClasses();

        const allMatrixClasses = confusionMatrix.getAllMatrixClasses();

        expect(allMatrixClasses[0].trueClasses).toEqual(Apple);
        expect(allMatrixClasses[1].trueClasses).toEqual(Orange);
        expect(allMatrixClasses[2].trueClasses).toEqual(Mango);

    });

    it("Can calculate the matrix accuracy", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getMatrixClasses();

        // Expected values for each label
        const expectedAppleAccuracyValue = (Apple.truePositive + Apple.trueNegative) /
            (Apple.trueNegative + Apple.truePositive + Apple.falsePositive + Apple.falseNegative);

        const expectedOrangeAccuracyValue = (Orange.truePositive + Orange.trueNegative) /
            (Orange.trueNegative + Orange.truePositive + Orange.falsePositive + Orange.falseNegative);

        const expectedMangoAccuracyValue = (Mango.truePositive + Mango.trueNegative) /
            (Mango.trueNegative + Mango.truePositive + Mango.falsePositive + Mango.falseNegative);

        // Test Apple accuracy.
        let value = confusionMatrix.accuracy(configuration);
        expect(value).toBe((expectedAppleAccuracyValue))

        // Test Orange accuracy.
        configuration.label = 'Orange';
        value = confusionMatrix.accuracy(configuration);
        expect(value).toBe((expectedOrangeAccuracyValue))

        // Test Mango accuracy.
        configuration.label = 'Mango';
        value = confusionMatrix.accuracy(configuration);
        expect(value).toBe((expectedMangoAccuracyValue));

        // Expected matrix accuracy value.
        const expectedMatrixAccuracyValue = (expectedAppleAccuracyValue + expectedOrangeAccuracyValue +
            expectedMangoAccuracyValue) / 3

        // Test matrix accuracy.
        value = confusionMatrix.accuracy();
        expect(value).toBe(expectedMatrixAccuracyValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight accuracy value.
        const expectedWeightMatrixAccuracyValue =
            ((expectedAppleAccuracyValue * predictionsLabel.Apple) +
                (expectedOrangeAccuracyValue * predictionsLabel.Orange) +
                (expectedMangoAccuracyValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted accuracy.
        value = confusionMatrix.accuracy({ weighted: true });
        expect(value).toBe(expectedWeightMatrixAccuracyValue);
    });

    it("Can calculate the matrix miss classification rate", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getMatrixClasses();


        // Expected values for each label
        const expectedAppleRateValue = (Apple.falsePositive + Apple.falseNegative) /
            (Apple.trueNegative + Apple.truePositive + Apple.falsePositive + Apple.falseNegative);

        const expectedOrangeRateValue = (Orange.falsePositive + Orange.falseNegative) /
            (Orange.trueNegative + Orange.truePositive + Orange.falsePositive + Orange.falseNegative);

        const expectedMangoRateValue = (Mango.falsePositive + Mango.falseNegative) /
            (Mango.trueNegative + Mango.truePositive + Mango.falsePositive + Mango.falseNegative);

        // Test Apple miss classification.
        let value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedAppleRateValue))

        // Test Orange miss classification.
        configuration.label = 'Orange';
        value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedOrangeRateValue))

        // Test Mango miss classification.
        configuration.label = 'Mango';
        value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedMangoRateValue));

        // Expected matrix miss classification rate.
        const expectedMatrixRateValue = (expectedAppleRateValue + expectedOrangeRateValue +
            expectedMangoRateValue) / 3

        // Test matrix miss classification rate.
        value = confusionMatrix.missClassificationRate();
        expect(value).toBe(expectedMatrixRateValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight miss classification rate value.
        const expectedWeightMatrixRateValue =
            ((expectedAppleRateValue * predictionsLabel.Apple) +
                (expectedOrangeRateValue * predictionsLabel.Orange) +
                (expectedMangoRateValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted miss classification rate value..
        value = confusionMatrix.missClassificationRate({ weighted: true });
        expect(value).toBe(expectedWeightMatrixRateValue);
    });

});