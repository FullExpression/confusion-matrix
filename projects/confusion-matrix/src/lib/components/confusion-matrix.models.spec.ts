import { Average, ConfusionMatrix, ConfusionMatrixClasses } from "./confusion-matrix.models";

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

    const getConfusionMatrixClasses = () => {
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

    const getSumConfusionMatrixClasses = (): ConfusionMatrixClasses => {
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();
        return {
            truePositive: Apple.truePositive + Orange.truePositive + Mango.truePositive,
            trueNegative: Apple.trueNegative + Orange.trueNegative + Mango.trueNegative,
            falsePositive: Apple.falsePositive + Orange.falsePositive + Mango.falsePositive,
            falseNegative: Apple.falseNegative + Orange.falseNegative + Mango.falseNegative
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
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();

        const appleMatrixClass = confusionMatrix.getConfusionMatrixClasses('Apple');
        const orangeMatrixClass = confusionMatrix.getConfusionMatrixClasses('Orange');
        const mangoMatrixClass = confusionMatrix.getConfusionMatrixClasses('Mango');

        expect(appleMatrixClass).toEqual(Apple);
        expect(orangeMatrixClass).toEqual(Orange);
        expect(mangoMatrixClass).toEqual(Mango);

        expect(() => confusionMatrix.getConfusionMatrixClasses(''))
            .toThrow(new Error('A valid label should be passed.'));

        expect(() => confusionMatrix.getConfusionMatrixClasses('abc'))
            .toThrow(new Error('The label does not exists in the matrix.'));

    });

    it("Can get all true classes.", () => {
        const confusionMatrix = getConfusionMatrix();
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();

        const allMatrixClasses = confusionMatrix.getAllMatrixClasses();

        expect(allMatrixClasses[0].confusionMatrixClasses).toEqual(Apple);
        expect(allMatrixClasses[1].confusionMatrixClasses).toEqual(Orange);
        expect(allMatrixClasses[2].confusionMatrixClasses).toEqual(Mango);

    });

    it("Can calculate the matrix accuracy", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();

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

        const sumMatrixClasses = getSumConfusionMatrixClasses();

        // Expected micro accuracy value.
        const microAccuracyValue = (sumMatrixClasses.truePositive + sumMatrixClasses.trueNegative) /
            (sumMatrixClasses.truePositive + sumMatrixClasses.trueNegative + sumMatrixClasses.falsePositive + sumMatrixClasses.falseNegative);

        // Test matrix accuracy.
        value = confusionMatrix.accuracy({ average: Average.Micro });
        expect(value).toBe(microAccuracyValue);

        // Expected micro accuracy value.
        const macroAccuracyValue = (expectedAppleAccuracyValue + expectedOrangeAccuracyValue
            + expectedMangoAccuracyValue) / 3;

        // Test matrix accuracy.
        value = confusionMatrix.accuracy({ average: Average.Macro });
        expect(value).toBe(macroAccuracyValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight accuracy value.
        const expectedWeightMatrixAccuracyValue =
            ((expectedAppleAccuracyValue * predictionsLabel.Apple) +
                (expectedOrangeAccuracyValue * predictionsLabel.Orange) +
                (expectedMangoAccuracyValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted accuracy.
        value = confusionMatrix.accuracy({ average: Average.Weighted });
        expect(value).toBe(expectedWeightMatrixAccuracyValue);

        value = confusionMatrix.accuracy();
        expect(value).toBe(expectedWeightMatrixAccuracyValue);
    });

    it("Can calculate the matrix miss classification rate", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();


        // Expected values for each label
        const expectedAppleMissClassificationValue = (Apple.falsePositive + Apple.falseNegative) /
            (Apple.trueNegative + Apple.truePositive + Apple.falsePositive + Apple.falseNegative);

        const expectedOrangeMissClassificationValue = (Orange.falsePositive + Orange.falseNegative) /
            (Orange.trueNegative + Orange.truePositive + Orange.falsePositive + Orange.falseNegative);

        const expectedMangoMissClassificationValue = (Mango.falsePositive + Mango.falseNegative) /
            (Mango.trueNegative + Mango.truePositive + Mango.falsePositive + Mango.falseNegative);

        // Test Apple miss classification value.
        let value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedAppleMissClassificationValue))

        // Test Orange miss classification value.
        configuration.label = 'Orange';
        value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedOrangeMissClassificationValue))

        // Test Mango miss classification value.
        configuration.label = 'Mango';
        value = confusionMatrix.missClassificationRate(configuration);
        expect(value).toBe((expectedMangoMissClassificationValue));

        const sumMatrixClasses = getSumConfusionMatrixClasses();

        // Expected micro miss classification value.
        const microMissClassificationValue = (sumMatrixClasses.truePositive + sumMatrixClasses.trueNegative) /
            (sumMatrixClasses.truePositive + sumMatrixClasses.trueNegative + sumMatrixClasses.falsePositive + sumMatrixClasses.falseNegative);

        // Test matrix rate value.
        value = confusionMatrix.missClassificationRate({ average: Average.Micro });
        expect(value).toBe(microMissClassificationValue);

        // Expected micro rate value.
        const macroMissClassificationValue = (expectedAppleMissClassificationValue + expectedOrangeMissClassificationValue
            + expectedMangoMissClassificationValue) / 3;

        // Test matrix rate.
        value = confusionMatrix.missClassificationRate({ average: Average.Macro });
        expect(value).toBe(macroMissClassificationValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight rate value.
        const expectedWeightMatrixRateValue =
            ((expectedAppleMissClassificationValue * predictionsLabel.Apple) +
                (expectedOrangeMissClassificationValue * predictionsLabel.Orange) +
                (expectedMangoMissClassificationValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted miss classification value.
        value = confusionMatrix.missClassificationRate({ average: Average.Weighted });
        expect(value).toBe(expectedWeightMatrixRateValue);

        value = confusionMatrix.missClassificationRate();
        expect(value).toBe(expectedWeightMatrixRateValue);
    });

    it("Can calculate the matrix precision value.", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();


        // Expected values for each label
        const expectedApplePrecisionValue = (Apple.truePositive) /
            (Apple.truePositive + Apple.falsePositive);

        const expectedOrangePrecisionValue = (Orange.truePositive) /
            (Orange.truePositive + Orange.falsePositive);

        const expectedMangoPrecisionValue = (Mango.truePositive) /
            (Mango.truePositive + Mango.falsePositive);

        // Test Apple precision.
        let value = confusionMatrix.precision(configuration);
        expect(value).toBe((expectedApplePrecisionValue))

        // Test Orange precision.
        configuration.label = 'Orange';
        value = confusionMatrix.precision(configuration);
        expect(value).toBe((expectedOrangePrecisionValue))

        const sumMatrixClasses = getSumConfusionMatrixClasses();

        // Expected micro precision value.
        const microPrecisionValue = (sumMatrixClasses.truePositive) /
            (sumMatrixClasses.truePositive + sumMatrixClasses.falsePositive);

        // Test matrix precision value.
        value = confusionMatrix.precision({ average: Average.Micro });
        expect(value).toBe(microPrecisionValue);

        // Expected micro rate value.
        const macroPrecisionValue = (expectedApplePrecisionValue + expectedOrangePrecisionValue
            + expectedMangoPrecisionValue) / 3;

        // Test matrix rate.
        value = confusionMatrix.precision({ average: Average.Macro });
        expect(value).toBe(macroPrecisionValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight rate value.
        const expectedWeightMatrixRateValue =
            ((expectedApplePrecisionValue * predictionsLabel.Apple) +
                (expectedOrangePrecisionValue * predictionsLabel.Orange) +
                (expectedMangoPrecisionValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted precision value.
        value = confusionMatrix.precision({ average: Average.Weighted });
        expect(value).toBe(expectedWeightMatrixRateValue);

        // Should use weighted as default average value.
        value = confusionMatrix.precision();
        expect(value).toBe(expectedWeightMatrixRateValue);
    });

    it("Can calculate the matrix recall value.", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();


        // Expected values for each label
        const expectedAppleRecallValue = (Apple.truePositive) /
            (Apple.truePositive + Apple.falseNegative);

        const expectedOrangeRecallValue = (Orange.truePositive) /
            (Orange.truePositive + Orange.falseNegative);

        const expectedMangoRecallValue = (Mango.truePositive) /
            (Mango.truePositive + Mango.falseNegative);

        // Test Apple precision.
        let value = confusionMatrix.recall(configuration);
        expect(value).toBe((expectedAppleRecallValue))

        // Test Orange precision.
        configuration.label = 'Orange';
        value = confusionMatrix.recall(configuration);
        expect(value).toBe((expectedOrangeRecallValue))

        // Test Mango precision.
        configuration.label = 'Mango';
        value = confusionMatrix.recall(configuration);
        expect(value).toBe((expectedMangoRecallValue));

        const sumMatrixClasses = getSumConfusionMatrixClasses();

        // Expected micro recall value.
        const microRecallValue = (sumMatrixClasses.truePositive) /
            (sumMatrixClasses.truePositive + sumMatrixClasses.falseNegative);

        // Test matrix precision value.
        value = confusionMatrix.recall({ average: Average.Micro });
        expect(value).toBe(microRecallValue);

        // Expected macro recall value.
        const macroRecallValue = (expectedAppleRecallValue + expectedOrangeRecallValue
            + expectedMangoRecallValue) / 3;

        // Test matrix recall value..
        value = confusionMatrix.recall({ average: Average.Macro });
        expect(value).toBe(macroRecallValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight recall value.
        const expectedWeightMatrixRecallValue =
            ((expectedAppleRecallValue * predictionsLabel.Apple) +
                (expectedOrangeRecallValue * predictionsLabel.Orange) +
                (expectedMangoRecallValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted recall value.
        value = confusionMatrix.recall({ average: Average.Weighted });
        expect(value).toBe(expectedWeightMatrixRecallValue);

        // Should use weighted as default recall value.
        value = confusionMatrix.recall();
        expect(value).toBe(expectedWeightMatrixRecallValue);
    });

    it("Can calculate the matrix specificity value.", () => {
        const confusionMatrix = getConfusionMatrix();
        const configuration = {
            label: 'Apple',
            weight: false
        };
        const { Apple, Orange, Mango } = getConfusionMatrixClasses();


        // Expected values for each label
        const expectedAppleSpecificityValue = (Apple.trueNegative) /
            (Apple.trueNegative + Apple.falsePositive);

        const expectedOrangeSpecificityValue = (Orange.trueNegative) /
            (Orange.trueNegative + Orange.falsePositive);

        const expectedMangoSpecificityValue = (Mango.trueNegative) /
            (Mango.trueNegative + Mango.falsePositive);

        // Test Apple specificity.
        let value = confusionMatrix.specificity(configuration);
        expect(value).toBe((expectedAppleSpecificityValue))

        // Test Orange specificity.
        configuration.label = 'Orange';
        value = confusionMatrix.specificity(configuration);
        expect(value).toBe((expectedOrangeSpecificityValue))

        // Test Mango specificity.
        configuration.label = 'Mango';
        value = confusionMatrix.specificity(configuration);
        expect(value).toBe((expectedMangoSpecificityValue));

        const sumMatrixClasses = getSumConfusionMatrixClasses();

        // Expected micro precision value.
        const microSpecificityValue = (sumMatrixClasses.trueNegative) /
            (sumMatrixClasses.trueNegative + sumMatrixClasses.falsePositive);

        // Test matrix precision value.
        value = confusionMatrix.specificity({ average: Average.Micro });
        expect(value).toBe(microSpecificityValue);

        // Expected macro specificity value.
        const macroSpecificityValue = (expectedAppleSpecificityValue + expectedOrangeSpecificityValue
            + expectedMangoSpecificityValue) / 3;

        // Test matrix rate.
        value = confusionMatrix.specificity({ average: Average.Macro });
        expect(value).toBe(macroSpecificityValue);

        const predictionsLabel = getLabelsPredictionsSum();

        // Expected matrix weight specificity value.
        const expectedWeightMatrixRateValue =
            ((expectedAppleSpecificityValue * predictionsLabel.Apple) +
                (expectedOrangeSpecificityValue * predictionsLabel.Orange) +
                (expectedMangoSpecificityValue * predictionsLabel.Mango)) / getPredictionsSum();

        // Test matrix weighted specificity value.
        value = confusionMatrix.specificity({ average: Average.Weighted });
        expect(value).toBe(expectedWeightMatrixRateValue);

        // Should use weighted as default specificity value.
        value = confusionMatrix.specificity();
        expect(value).toBe(expectedWeightMatrixRateValue);
    });

});