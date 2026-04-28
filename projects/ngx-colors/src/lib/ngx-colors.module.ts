import { NgModule } from "@angular/core";
import { NgxColorsComponent } from "./ngx-colors.component";
import { NgxColorsTriggerDirective } from "./directives/ngx-colors-trigger.directive";

@NgModule({
  imports: [NgxColorsComponent, NgxColorsTriggerDirective],
  exports: [NgxColorsComponent, NgxColorsTriggerDirective],
})
export class NgxColorsModule {}
