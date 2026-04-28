import { Component } from "@angular/core";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from "@angular/material/button-toggle";

@Component({
  selector: "app-hide-elements-example",
  templateUrl: "./hide-elements-example.component.html",
  styleUrls: ["./hide-elements-example.component.scss"],
  imports: [
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggle,
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
})
export class HideElementsExampleComponent {
  constructor() {}

  colorPickerControls: "default" | "only-alpha" | "no-alpha" = "default";
  hideColorPicker: boolean = true;
  hideTextInput: boolean = true;
  color: string = "#EC407A";
}
