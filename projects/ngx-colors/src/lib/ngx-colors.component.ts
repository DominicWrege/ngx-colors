import {
  Component,
  Host,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  OutputRefSubscription,
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

  constructor(
    private cdRef: ChangeDetectorRef,
    @Host() private triggerDirective: NgxColorsTriggerDirective,
  ) {}

  ngOnInit(): void {
    this.triggerDirectiveColorChangeSubscription =
      this.triggerDirective.change.subscribe((color) => {
        this.color = color;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.triggerDirectiveColorChangeSubscription) {
      this.triggerDirectiveColorChangeSubscription.unsubscribe();
    }
  }

  //IO color
  color: string = this.triggerDirective.color;
}
