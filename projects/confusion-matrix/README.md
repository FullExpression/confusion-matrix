# Confusion Matrix Library

⚠️ *This library only works in angular applications!* ⚠️

*If you find out any bug, issue or you just want to give suggestions, please, submit it [here](https://github.com/FullExpression/confusion-matrix/issues)*

## ✌️ Introduction

This library aims to help programers integrate confusion matrix tools in their websites, giving a boost of productivity to all data sciences and data engineers.

## 👨‍🏫 Examples

You can see visually how the library looks like as well different configurations [here](https://fe-confusion-matrix.web.app/).

In [here](https://github.com/FullExpression/confusion-matrix/tree/master/projects/web-app) you can find the source code of the example shown before.

## 🔨 How to install

In the command line, run the following command `npm install @fullexpression/confusion-matrix`.

*You can find all npm package versions [here](https://github.com/FullExpression/confusion-matrix/packages/630932/versions)*.

## 👩‍💻 How to use it

1. Import the `ConfusionMatrixModule` angular module in your application:

```ts
@NgModule({
    declarations: [...],
    imports: [...],
    providers: [...],
    bootstrap: [...]
})
export class YourApplicationModule { }
```

2. Create a new `ConfusionMatrix` object:

```ts
const confusionMatrix = new ConfusionMatrix({
    labels: ["Happiness", "Sadness"], 
    matrix: [[50, 2],
             [8, 50]]
});
```

3. Import `ConfusionMatrix` component to your html and pass the confusion `confusionMatrix` object created in the step before:

```html
<confusion-matrix [confusionMatrix]="confusionMatrix"></confusion-matrix>
```

## 🗂 Documentation

The documentation is generated automatically by [compodoc](https://compodoc.app/) and can be found [here](https://doc-confusion-matrix.web.app/).

Nevertheless:

1. For **basic confusion matrix manipulation and calculations**, check out the api [here](https://doc-confusion-matrix.web.app/classes/ConfusionMatrix.html).
2. **To setup and show confusion matrix in your website**, check out the api [here](https://doc-confusion-matrix.web.app/classes/ConfusionMatrix.html).




