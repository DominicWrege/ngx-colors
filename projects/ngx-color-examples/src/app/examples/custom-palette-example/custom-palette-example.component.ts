import { Component } from "@angular/core";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-custom-palette-example",
  templateUrl: "./custom-palette-example.component.html",
  styleUrls: ["./custom-palette-example.component.scss"],
  imports: [
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    JsonPipe,
  ],
})
export class CustomPaletteExampleComponent {
  constructor() {}

  selectedColor: string = "#9C27B0";
  colorToAdd: string = "#EC407A";
  colorPalette: Array<any> = [
    {
      preview: "#9c27b0e0",
      variants: [
        "#9c27b0",
        "#9c27b0de",
        "#9c27b0bd",
        "#9c27b09c",
        "#9c27b075",
        "#9c27b047",
      ],
    },
    "#00BCD4",
    "#03A9F4",
    "#B2F35C",
  ];

  public addToPalette() {
    this.colorPalette.push(this.colorToAdd);
  }
}
