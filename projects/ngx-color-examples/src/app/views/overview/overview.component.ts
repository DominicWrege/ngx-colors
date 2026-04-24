import { Component } from "@angular/core";
import { FormControl, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { examples } from "../../const/examples";
import { snippets } from "../../const/snippets";
import { Highlight } from "ngx-highlightjs";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";
import { MatFormField, MatInput } from "@angular/material/input";
import { DetectChangeExampleComponent } from "../../examples/detect-change-example/detect-change-example.component";
import { DocumentViewerComponent } from "../../components/document-viewer/document-viewer.component";

@Component({
    selector: "app-overview-example",
    templateUrl: "./overview.component.html",
    styleUrls: ["./overview.component.scss"],
    imports: [
        Highlight,
        NgxColorsComponent,
        NgxColorsTriggerDirective,
        ReactiveFormsModule,
        FormsModule,
        MatFormField,
        MatInput,
        DetectChangeExampleComponent,
        DocumentViewerComponent,
    ],
})
export class OverviewComponent {
  constructor() {}
  snippets = snippets;
  examples = examples;
  color = "#42A5F5";
  colorFormControl = new FormControl<string>("#c2185b");
}
