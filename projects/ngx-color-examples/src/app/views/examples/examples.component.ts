import { Component } from "@angular/core";
import { examples } from "../../const/examples";
import { CustomTriggerExampleComponent } from "../../examples/custom-trigger-example/custom-trigger-example.component";
import { DocumentViewerComponent } from "../../components/document-viewer/document-viewer.component";
import { HideElementsExampleComponent } from "../../examples/hide-elements-example/hide-elements-example.component";
import { CustomPaletteExampleComponent } from "../../examples/custom-palette-example/custom-palette-example.component";
import { ChangeAcceptLabelExampleComponent } from "../../examples/change-accept-label/change-accept-label.component";
import { DirectionExampleComponent } from "../../examples/direction-example/direction-example.component";
import { ValidatorExampleComponent } from "../../examples/validator-example/validator-example.component";

@Component({
    selector: "app-examples-example",
    templateUrl: "./examples.component.html",
    styleUrls: ["./examples.component.scss"],
    imports: [CustomTriggerExampleComponent, DocumentViewerComponent, HideElementsExampleComponent, CustomPaletteExampleComponent, ChangeAcceptLabelExampleComponent, DirectionExampleComponent, ValidatorExampleComponent]
})
export class ExamplesComponent {
  constructor() {}
  examples = examples;
}
