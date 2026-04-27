import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ChangeDetectorRef,
  OnChanges,
  input,
  output,
  viewChild,
  model,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";

import { SliderDimension, SliderPosition } from "../../clases/slider";

import { ConverterService } from "../../services/converter.service";
import { SliderDirective } from "../../directives/slider.directive";
import { NgStyle } from "@angular/common";
import { Hsva } from "../../clases/formats";

@Component({
  selector: "color-picker",
  templateUrl: "./color-picker.component.html",
  styleUrls: ["./color-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SliderDirective, NgStyle],
})
export class ColorPickerComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  //IO color
  readonly color = model(new Hsva(0, 1, 1, 1));
  readonly controls = input<"default" | "only-alpha" | "no-alpha">("default");
  readonly dir = input<"ltr" | "rtl">("ltr");
  readonly sliderChange = output<Hsva>();
  readonly onAlphaChange = output<any>();
  //Event triggered when any slider change
  // @Output() colorSelectedChange:EventEmitter<Hsva> = new EventEmitter<Hsva>(false);

  private hsva: Hsva = new Hsva(0, 1, 1, 1);
  private outputColor: Hsva | undefined;
  public selectedColor = signal("#000000");

  // private sHue: number;
  private sliderDimMax: SliderDimension | undefined;
  public slider: SliderPosition | undefined;

  public hueSliderColor: string | undefined;
  public alphaSliderColor: string | undefined;

  readonly hueSlider = viewChild<ElementRef>("hueSlider");
  readonly alphaSlider = viewChild<ElementRef>("alphaSlider");

  constructor(
    private service: ConverterService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (!this.color) {
      this.setColor(new Hsva(0, 1, 1, 1));
    }
    this.slider = new SliderPosition(0, 0, 0, 0);
    this.update();
  }

  ngOnDestroy(): void {}

  ngOnChanges(changes: any): void {
    if (changes.color && this.color()) {
      this.update();
    }
  }

  ngAfterViewInit(): void {
    const hueWidth = this.hueSlider()?.nativeElement.offsetWidth || 140;
    const alphaWidth = this.alphaSlider()?.nativeElement.offsetWidth || 140;
    this.sliderDimMax = new SliderDimension(hueWidth, 220, 130, alphaWidth);
    this.update();
  }

  public onSliderChange(
    type: string,
    event: { s: number; v: number; rgX: number; rgY: number },
  ) {
    switch (type) {
      case "saturation-lightness":
        this.hsva.onColorChange(event);
        break;
      case "hue":
        this.hsva.onHueChange(event);
        break;
      case "alpha":
        this.hsva.onAlphaChange(event);
        this.onAlphaChange.emit(event);
        break;
      case "value":
        this.hsva.onValueChange(event);
        break;
    }
    // this.sHue = this.hsva.h;
    this.update();
    if (this.outputColor) {
      this.setColor(this.outputColor);
    }
  }

  setColor(color: Hsva) {
    this.color.set(color);
    this.sliderChange.emit(this.color());
  }

  public getBackgroundColor(color: string) {
    return {
      background:
        "linear-gradient(90deg, rgba(36,0,0,0) 0%, " + color + " 100%)",
    };
  }

  private update(): void {
    this.hsva = this.color();
    if (this.sliderDimMax) {
      const isRtl = this.dir() === "rtl";
      const horizontalPosition = (value: number, max: number, offset: number) =>
        (isRtl ? 1 - value : value) * max - offset;

      let rgba = this.service.hsvaToRgba(this.hsva).denormalize();
      let hue = this.service
        .hsvaToRgba(new Hsva(this.hsva.h, 1, 1, 1))
        .denormalize();

      this.hueSliderColor = "rgb(" + hue.r + "," + hue.g + "," + hue.b + ")";
      this.alphaSliderColor =
        "rgb(" + rgba.r + "," + rgba.g + "," + rgba.b + ")";

      this.outputColor = this.hsva;
      this.selectedColor.set(this.service.hsvaToRgba(this.hsva).toString());

      this.slider = new SliderPosition(
        // (this.sHue || this.hsva.h) * this.sliderDimMax.h - 8,
        horizontalPosition(this.hsva.h, this.sliderDimMax.h, 5),
        horizontalPosition(this.hsva.s, this.sliderDimMax.s, 8),
        (1 - this.hsva.v) * this.sliderDimMax.v - 8,
        horizontalPosition(this.hsva.a, this.sliderDimMax.a, 5),
      );
      this.cdr.detectChanges();
    }
  }
}
