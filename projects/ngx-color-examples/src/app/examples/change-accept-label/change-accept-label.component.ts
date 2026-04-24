import { Component } from '@angular/core';
import { NgxColorsComponent } from '../../../../../ngx-colors/src/lib/ngx-colors.component';
import { NgxColorsTriggerDirective } from '../../../../../ngx-colors/src/lib/directives/ngx-colors-trigger.directive';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-change-label-example',
    templateUrl: './change-accept-label.component.html',
    styleUrls: ['./change-accept-label.component.scss'],
    imports: [NgxColorsComponent, NgxColorsTriggerDirective, ReactiveFormsModule, FormsModule]
})
export class ChangeAcceptLabelExampleComponent {

  constructor() { }
  color:string = '#EC407A';

}
