import { Component } from "@angular/core";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Dir } from "@angular/cdk/bidi";

@Component({
  selector: "app-direction-example",
  templateUrl: "./direction-example.component.html",
  styleUrls: ["./direction-example.component.scss"],
  imports: [
    NgxColorsComponent,
    NgxColorsTriggerDirective,
    ReactiveFormsModule,
    FormsModule,
    Dir,
  ],
})
export class DirectionExampleComponent {
  ltrColor = "#2196F3";
  rtlColor = "#FF5722";
}
