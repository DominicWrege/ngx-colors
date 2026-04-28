# ngx-colors2

ngx-colors2 is a fork of [KroneCorylus/ngx-colors](https://github.com/KroneCorylus/ngx-colors). It is a colorpicker component for Angular with a material kind of design style, allowing users to select a color via text input (hexadecimal, rgba, hsla), choose a preset color from the palette, or use a color picker with Hue, Lightness, and Alpha sliders.

## Main Fork Changes

- Angular 20+ ready
- signals usage
- No animations required (does not depend on `@angular/animations`)
- Up-to-date `ngx-highlightjs` support

## Demo and documentation

```sh
pnpm start
```

http://localhost:4200

## Preview

![example gif](https://raw.githubusercontent.com/KroneCorylus/ngx-colors/master/projects/ngx-color-examples/src/assets/img/example-gif.gif)

## Installation

#### Compatibility

| Angular | Latest ngx-colors compatible |
| ------- | ---------------------------- |
| >=20    | 4.x                          |

#### Npm

```shell
npm install ngx-colors2
```

#### Standalone support just import the component and direct

```ts
import { NgxColorsTriggerDirective, NgxColorsComponent } from "ngx-colors2";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-example",
  templateUrl: "./app-example.html",
  imports: [NgxColorsTriggerDirective, NgxColorsComponent, FormsModule],
})
export class AppExample {
  // ...
}
```

##### Load the ngx-colors module in your app module:

```javascript
import { NgxColorsModule } from "ngx-colors2";

@NgModule({
  ...
  imports: [
    ...
    NgxColorsModule
  ]
})
```

## Overview and usage

This library is composed of two parts:

1. ngx-colors-trigger: This directive can be applied to any html element turning it into a trigger that when clicked will open the color picker
2. ngx-colors: This component is a premade button that will display the selected color.

##### Use it in your HTML template with ngModel:

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color"></ngx-colors>
```

You can select just one format:

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color" [format]="'hex'"></ngx-colors>
```

Or you can choise some formats

```html
<ngx-colors ngx-colors-trigger [(ngModel)]="color" [formats]="['hex','cmyk']"></ngx-colors>
```

##### Or with Reactive Forms:

```html
<form class="example-form">
  <ngx-colors ngx-colors-trigger style="display: inline-block; margin:5px;" [formControl]="colorFormControl"></ngx-colors>
</form>
```
