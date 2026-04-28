import { NgModule } from "@angular/core";
import { NgxColorsComponent } from "./ngx-colors.component";
import { ColorPickerComponent } from "./components/color-picker/color-picker.component";
import { SliderDirective } from "./directives/slider.directive";
import { PanelComponent } from "./components/panel/panel.component";
import { NgxColorsTriggerDirective } from "./directives/ngx-colors-trigger.directive";

@NgModule({
  imports: [
    NgxColorsComponent,
    ColorPickerComponent,
    SliderDirective,
    PanelComponent,
    NgxColorsTriggerDirective,
  ],
  exports: [NgxColorsComponent, NgxColorsTriggerDirective],
})
export class NgxColorsModule {}
