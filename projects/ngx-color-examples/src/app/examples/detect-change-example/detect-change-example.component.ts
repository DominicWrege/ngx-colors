import { Component } from "@angular/core";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-detect-change-example",
  templateUrl: "./detect-change-example.component.html",

  styleUrls: ["./detect-change-example.style.scss"],
  imports: [
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
  ],
})
export class DetectChangeExampleComponent {
  constructor() {}

  color = "#0070f3";
  colorIndex = 0;
  colors = ["#0070f3", "#00796B", "#D81B60", "#7986CB"];

  logs: Array<Array<any>> = [];

  public rotateColor(): void {
    this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    this.color = this.colors[this.colorIndex];
  }

  public logEvent(event, trigger) {
    this.logs.unshift([this.logs.length + 1, trigger, event]);
  }
}
