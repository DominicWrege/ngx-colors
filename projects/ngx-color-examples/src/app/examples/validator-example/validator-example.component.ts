import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { validColorValidator } from "../../../../../ngx-colors/src/public-api";
import { MatFormField, MatLabel, MatInput, MatSuffix, MatError } from "@angular/material/input";
import { NgxColorsComponent } from "../../../../../ngx-colors/src/lib/ngx-colors.component";
import { NgxColorsTriggerDirective } from "../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive";

@Component({
    selector: "app-validator-example",
    templateUrl: "./validator-example.component.html",
    styleUrls: ["./validator-example.component.scss"],
    imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, NgxColorsComponent, MatSuffix, NgxColorsTriggerDirective, MatError]
})
export class ValidatorExampleComponent implements OnInit {
  constructor() {}

  public exampleForm: FormGroup = new FormGroup(
    {
      inputCtrl: new FormControl("rgb(79, 195, 255)", validColorValidator()),
      pickerCtrl: new FormControl("rgb(79, 195, 255)"),
    },
    { updateOn: "change" }
  );

  ngOnInit(): void {
    this.exampleForm.controls["inputCtrl"].valueChanges.subscribe((color) => {
      if (this.exampleForm.controls["pickerCtrl"].valid) {
        this.exampleForm.controls["pickerCtrl"].setValue(color, {
          emitEvent: false,
        });
      }
    });
    this.exampleForm.controls["pickerCtrl"].valueChanges.subscribe((color) =>
      this.exampleForm.controls["inputCtrl"].setValue(color, {
        emitEvent: false,
      })
    );
  }
}
