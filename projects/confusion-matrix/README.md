# Confusion Matrix Library

[![publish-master](https://github.com/FullExpression/confusion-matrix/actions/workflows/publish-master.yml/badge.svg?branch=master)](https://github.com/FullExpression/confusion-matrix/actions/workflows/publish-master.yml)

⚠️ *This library only works in angular applications!* ⚠️

*If you find out any bug, issue or you just want to give suggestions, please, submit it [here](https://github.com/FullExpression/confusion-matrix/issues)*

## ✌️ Introduction

This library aims to help programers integrate confusion matrix tools in their websites, giving a boost of productivity to all data sciences and data engineers.

## 👨‍🏫 Examples

In the library [official website](https://fe-confusion-matrix.web.app/), there is a [confusion matrix editor](https://fe-confusion-matrix.web.app/editor) which uses this library there.

Also, [here](https://github.com/FullExpression/confusion-matrix/tree/master/projects/web-app) you can check the official website source code and you can find the editor component which implements the library [here](https://fe-confusion-matrix.web.app/#/editor).


## 🔨 How to install

In the command line, run the following command `npm install @fullexpression/confusion-matrix`.

*You can find all npm package versions [here](https://github.com/FullExpression/confusion-matrix/packages/630932/versions)*.

**Important Note**: This library has dependencies to [@fullexpression/confusion-matrix-stats](https://github.com/FullExpression/confusion-matrix-stats), [html2canvas](https://github.com/niklasvh/html2canvas) and [angular2-draggable](https://github.com/xieziyu/angular2-draggable).
Make sure these packages are install as well (you can check on `node_modules/@fullexpression/confusion-matrix-stats`, `node_modules/html2canvas` and `node_modules/@fullexpression/angular2-draggable`).


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

```typescript
import { ConfusionMatrix } from '@fullexpression/confusion-matrix-stats';

@Component(...)
export class MyComponent {
    confusionMatrix = new ConfusionMatrix({
        labels: ["Happiness", "Sadness"], 
        matrix: [[50, 2],
                [8, 50]]
    });
}

```

3. Import `ConfusionMatrix` component to your html and pass the confusion `confusionMatrix` object created in the step before:

```html
<confusion-matrix [confusionMatrix]="confusionMatrix"></confusion-matrix>
```

## 🗂 Documentation

The documentation is generated automatically by [compodoc](https://compodoc.app/) and can be found [here](https://doc-confusion-matrix.web.app/).

Nevertheless:

1. For **basic confusion matrix manipulation and calculations**, check out the api [here](https://fullexpression.github.io/confusion-matrix-stats/docs/index.html).
2. **To setup and show confusion matrix in your website**, check out the api [here](https://doc-confusion-matrix.web.app/components/ConfusionMatrixComponent.html).




