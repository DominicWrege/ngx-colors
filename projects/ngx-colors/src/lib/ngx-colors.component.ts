import {
  Component,
  Host,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  OutputRefSubscription,
  inject,
} from "@angular/core";
import { NgxColorsTriggerDirective } from "./directives/ngx-colors-trigger.directive";
import { NgStyle } from "@angular/common";

@Component({
  selector: "ngx-colors",
  templateUrl: "./ngx-colors.component.html",
  styleUrls: ["./ngx-colors.component.scss"],
  imports: [NgStyle],
})
export class NgxColorsComponent implements OnInit, OnDestroy {
  private triggerDirectiveColorChangeSubscription: OutputRefSubscription | null =
    null;

  readonly cdRef = inject(ChangeDetectorRef);

  constructor(@Host() private triggerDirective: NgxColorsTriggerDirective) {}

  ngOnInit(): void {
    this.triggerDirectiveColorChangeSubscription =
      this.triggerDirective.change.subscribe((color) => {
        this.color.set(color);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.triggerDirectiveColorChangeSubscription) {
      this.triggerDirectiveColorChangeSubscription.unsubscribe();
    }
  }

  //IO color
  readonly color = this.triggerDirective.color;
}
