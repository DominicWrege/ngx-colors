import {
  Component,
  OnInit,
  ElementRef,
  viewChild,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";

import { ColorFormats } from "../../enums/formats";
import { ConverterService } from "../../services/converter.service";
import { defaultColors } from "../../helpers/default-colors";
import { formats } from "../../helpers/formats";
import { NgxColorsTriggerDirective } from "../../directives/ngx-colors-trigger.directive";
import { Hsva } from "../../clases/formats";
import { NgStyle } from "@angular/common";
import {
  ColorPickerComponent,
  NgxColorsColor,
} from "../color-picker/color-picker.component";

type PanelInitiateOptions = {
  triggerInstance: NgxColorsTriggerDirective;
  triggerElementRef: ElementRef;
  color: string;
  palette: Array<string | NgxColorsColor> | undefined;
  format: string;
  hideTextInput: boolean;
  hideColorPicker: boolean;
  acceptLabel: string;
  cancelLabel: string;
  colorPickerControls: "default" | "only-alpha" | "no-alpha";
  position: "top" | "bottom";
  userFormats?: string[];
  dir?: "ltr" | "rtl";
};

@Component({
  selector: "ngx-colors-panel",
  templateUrl: "./panel.component.html",
  styleUrls: ["./panel.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[style.top.px]": "top()",
    "[style.left.px]": "left()",
    "(window:resize)": "onScreenMovement()",
    "(document:scroll)": "onScreenMovement()",
    "(document:mousedown)": "click($event)",
  },
  imports: [NgStyle, ColorPickerComponent],
})
export class PanelComponent implements OnInit {
  click(event: Event) {
    if (this.isOutside(event)) {
      this.emitClose("cancel");
    }
  }

  public top = signal(0);
  public left = signal(0);

  readonly panelRef = viewChild<ElementRef>("dialog");

  readonly service = inject(ConverterService);

  public color = signal("#000000");
  public previewColor: string | undefined = "#000000";
  public hsva = signal(new Hsva(0, 1, 1, 1));

  public palette = signal<(string | NgxColorsColor)[]>(defaultColors);
  public variants = signal<string[]>([]);

  public userFormats: string[] = [];
  public colorFormats = formats;
  public format: ColorFormats = ColorFormats.HEX;
  public formatMap: Record<string, ColorFormats> = {
    hex: ColorFormats.HEX,
    rgba: ColorFormats.RGBA,
    hsla: ColorFormats.HSLA,
    cmyk: ColorFormats.CMYK,
  };

  public canChangeFormat: boolean = true;

  public menu = signal(1);

  public hideColorPicker = signal(false);
  public hideTextInput = signal(false);
  public acceptLabel = signal<string | undefined>(undefined);
  public cancelLabel = signal<string | undefined>(undefined);
  public colorPickerControls = signal<"default" | "only-alpha" | "no-alpha">(
    "default",
  );
  public dir = signal<"ltr" | "rtl">("ltr");
  private triggerInstance!: NgxColorsTriggerDirective;
  private TriggerBBox: ElementRef | undefined;
  public isSelectedColorInPalette = false;
  public indexSeleccionado = signal<number | undefined>(0);
  public positionString = signal("");
  public temporalColor: Hsva | undefined;
  public backupColor = signal("#FFFFFF");
  public placeholder = signal("#FFFFFF");

  public ngOnInit() {
    this.setPosition();
    const newColor = this.service.stringToHsva(this.color());
    if (newColor) {
      this.hsva.set(newColor);
    }

    this.indexSeleccionado.set(this.findIndexSelectedColor(this.palette()));
  }
  public ngAfterViewInit() {
    this.setPositionY();
  }

  public onScreenMovement() {
    this.setPosition();
    this.setPositionY();
    const panelRef = this.panelRef();
    if (!panelRef?.nativeElement.style.transition) {
      panelRef!.nativeElement.style.transition = "transform 0.5s ease-out";
    }
  }

  private findIndexSelectedColor(
    colors: Array<string | NgxColorsColor>,
  ): number {
    const current = this.color();
    if (!current) return -1;

    const currentHex = this.service.stringToFormat(current, ColorFormats.HEX);

    return colors.findIndex((color) => {
      if (typeof color === "string") {
        return (
          currentHex === this.service.stringToFormat(color, ColorFormats.HEX)
        );
      }

      return this.findIndexSelectedColor(color.variants) !== -1;
    });
  }

  public iniciate({
    triggerInstance,
    triggerElementRef,
    color,
    palette,
    format,
    hideTextInput,
    hideColorPicker,
    acceptLabel,
    cancelLabel,
    colorPickerControls,
    position,
    userFormats = [],
    dir = "ltr",
  }: PanelInitiateOptions) {
    this.colorPickerControls.set(colorPickerControls);
    this.triggerInstance = triggerInstance;
    this.TriggerBBox = triggerElementRef;
    this.color.set(color);
    this.hideColorPicker.set(hideColorPicker);
    this.hideTextInput.set(hideTextInput);
    this.acceptLabel.set(acceptLabel);
    this.cancelLabel.set(cancelLabel);

    if (userFormats.length) {
      const allFormatsValid = userFormats.every((frt) => formats.includes(frt));
      if (allFormatsValid) {
        this.colorFormats = userFormats;
      }
    }

    if (format) {
      const normalizedFormat = format.toLowerCase();
      if (this.colorFormats.includes(normalizedFormat)) {
        this.format = this.colorFormats.indexOf(normalizedFormat);
        this.canChangeFormat = false;
        if (
          this.service.getFormatByString(this.color() ?? "") != normalizedFormat
        ) {
          const parsedColor = this.service.stringToHsva(this.color() ?? "");
          if (parsedColor) {
            this.setColor(parsedColor);
          }
        }
      } else {
        console.error("Format provided is invalid, using HEX");
        this.format = ColorFormats.HEX;
      }
    } else {
      this.format = this.colorFormats.indexOf(
        this.service.getFormatByString(this.color() ?? ""),
      );
      if (this.format < 0) {
        this.format = 0;
      }
    }

    this.previewColor = this.color();
    this.palette.set(palette ?? defaultColors);
    this.dir.set(dir);
    if (position == "top") {
      let TriggerBBox = this.TriggerBBox.nativeElement.getBoundingClientRect();
      this.positionString.set(
        "transform: translateY(calc( -100% - " + TriggerBBox.height + "px ))",
      );
    }
  }

  public setPosition(): void {
    if (this.TriggerBBox) {
      const panelWidth = 250;
      const isDocumentRTL = document.dir === "rtl";
      const viewportOffset =
        this.TriggerBBox.nativeElement.getBoundingClientRect();

      this.top.set(viewportOffset.top + viewportOffset.height);

      if (isDocumentRTL) {
        if (viewportOffset.left + panelWidth > window.innerWidth) {
          this.left.set(
            viewportOffset.left < panelWidth
              ? window.innerWidth / 2 + panelWidth / 2
              : viewportOffset.left + panelWidth,
          );
        } else {
          this.left.set(viewportOffset.left + panelWidth);
        }
      } else {
        if (viewportOffset.left + panelWidth > window.innerWidth) {
          this.left.set(
            viewportOffset.right < panelWidth
              ? window.innerWidth / 2 - panelWidth / 2
              : viewportOffset.right - panelWidth,
          );
        } else {
          this.left.set(viewportOffset.left);
        }
      }
    }
  }

  private setPositionY(): void {
    if (!this.TriggerBBox) {
      return;
    }

    const panelRef = this.panelRef();
    if (!panelRef) {
      return;
    }

    const triggerBBox = this.TriggerBBox.nativeElement.getBoundingClientRect();
    const panelBBox = panelRef.nativeElement.getBoundingClientRect();
    const panelHeight = panelBBox.height;
    // Check for space below the trigger
    if (triggerBBox.bottom + panelHeight > window.innerHeight) {
      // there is no space, move panel over the trigger
      this.positionString.set(
        triggerBBox.top < panelBBox.height
          ? "transform: translateY(-" + triggerBBox.bottom + "px );"
          : "transform: translateY(calc( -100% - " +
              triggerBBox.height +
              "px ));",
      );
    } else {
      this.positionString.set("");
    }
  }

  public hasVariant(color: string | NgxColorsColor): boolean {
    if (!this.previewColor) {
      return false;
    }
    return (
      typeof color != "string" &&
      color.variants.some(
        (v: string) => v.toUpperCase() == this.previewColor!.toUpperCase(),
      )
    );
  }

  public isSelected(color: string) {
    if (!this.previewColor) {
      return false;
    }
    return (
      typeof color == "string" &&
      color.toUpperCase() == this.previewColor.toUpperCase()
    );
  }

  public getBackgroundColor(color: string | NgxColorsColor) {
    if (typeof color == "string") {
      return { background: color };
    } else {
      return { background: color?.preview };
    }
  }

  public onAlphaChange(event: number | { v: number; rgX: number }) {
    this.palette.set(this.ChangeAlphaOnPalette(event, this.palette()));
  }

  private ChangeAlphaOnPalette(
    alpha: number | { v: number; rgX: number },
    colors: Array<string | NgxColorsColor>,
  ): Array<string | NgxColorsColor> {
    const alphaPayload =
      typeof alpha === "number" ? { v: alpha, rgX: 1 } : alpha;

    return colors
      .map((color) => {
        if (typeof color === "string") {
          const newColor = this.service.stringToHsva(color);
          if (!newColor) return null;

          newColor.onAlphaChange(alphaPayload);
          return this.service.toFormat(newColor, this.format);
        }

        const newColorPreview = this.service.stringToHsva(color.preview);
        if (!newColorPreview) return null;

        newColorPreview.onAlphaChange(alphaPayload);
        return {
          preview: this.service.toFormat(newColorPreview, this.format),
          variants: this.ChangeAlphaOnPalette(
            alphaPayload,
            color.variants,
          ).filter((item): item is string => typeof item === "string"),
        } satisfies NgxColorsColor;
      })
      .filter((item): item is string | NgxColorsColor => item !== null);
  }

  /**
   * Change color from default colors
   * @param string color
   */
  public changeColor(color: string): void {
    const parsedColor = this.service.stringToHsva(color);
    if (parsedColor) {
      this.setColor(parsedColor);
    }
    // this.triggerInstance.onChange();
    this.emitClose("accept");
  }

  public onChangeColorPicker(event: Hsva) {
    this.temporalColor = event;
    this.color.set(this.service.toFormat(event, this.format));
    // this.setColor(event);
    this.triggerInstance.sliderChange(
      this.service.toFormat(event, this.format),
    );
  }

  public changeColorManual(color: string): void {
    this.previewColor = color;
    this.color.set(color);
    const parsedColor = this.service.stringToHsva(color);
    if (!parsedColor) {
      return;
    }

    this.hsva.set(parsedColor);
    this.setPreviewColor(this.hsva());
    this.temporalColor = this.hsva();
    this.triggerInstance.setColor(this.color(), this.previewColor);
    // this.triggerInstance.onChange();
  }

  setColor(value: Hsva, colorIndex: number = -1) {
    this.hsva.set(value);

    let formatName = this.colorFormats[this.format];
    let index = colorIndex;
    if (index < 0) {
      index = this.formatMap[formatName] ?? ColorFormats.HEX;
    }

    this.color.set(this.service.toFormat(value, index));
    this.setPreviewColor(value);
    this.triggerInstance.setColor(this.color(), this.previewColor);
  }

  setPreviewColor(value: Hsva) {
    this.previewColor = value
      ? this.service.hsvaToRgba(value).toString()
      : undefined;
  }

  onChange() {
    // this.triggerInstance.onChange();
  }

  public onColorClick(color: string | NgxColorsColor) {
    if (typeof color == "string") {
      this.changeColor(color);
    } else {
      this.variants.set(color.variants);
      this.menu.set(2);
    }
  }

  public addColor() {
    this.menu.set(3);
    this.backupColor.set(this.color() ?? "");
    this.temporalColor =
      this.service.stringToHsva(this.color() ?? "") ?? undefined;
  }

  public nextFormat() {
    if (this.canChangeFormat) {
      this.format = (this.format + 1) % this.colorFormats.length;

      let formatName = this.colorFormats[this.format];
      let index = this.formatMap[formatName] ?? ColorFormats.HEX;

      this.setColor(this.hsva(), index);
      this.placeholder.set(this.service.toFormat(new Hsva(0, 0, 1, 1), index));
    }
  }

  public emitClose(status: "cancel" | "accept") {
    if (this.menu() == 3) {
      if (status == "cancel") {
      } else if (status == "accept") {
        if (this.temporalColor) {
          this.setColor(this.temporalColor);
        }
      }
    }
    this.triggerInstance.closePanel();
  }

  public onClickBack() {
    if (this.menu() == 3) {
      this.color.set(this.backupColor());
      const parsedColor = this.service.stringToHsva(this.color() ?? "");
      if (parsedColor) {
        this.hsva.set(parsedColor);
      }
    }
    this.indexSeleccionado.set(this.findIndexSelectedColor(this.palette()));
    this.menu.set(1);
  }

  isOutside(event: Event) {
    const target = event.target as HTMLElement | null;
    return !!target?.classList?.contains("ngx-colors-overlay");
  }
}
