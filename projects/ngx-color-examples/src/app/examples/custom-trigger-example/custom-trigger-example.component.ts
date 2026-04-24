import { Component } from "@angular/core";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: "app-custom-trigger-example",
    templateUrl: "./custom-trigger-example.component.html",
    styleUrls: ["./custom-trigger-example.component.scss"],
    imports: [NgxColorsTriggerDirective, ReactiveFormsModule, FormsModule, MatIcon]
})
export class CustomTriggerExampleComponent {
  constructor() {}

  input1: string = "#00897B";
}
