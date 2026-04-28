import {
  Directive,
  ElementRef,
  ComponentRef,
  HostListener,
  forwardRef,
  OnDestroy,
  input,
  output,
  signal,
  inject,
} from "@angular/core";
import { PanelFactoryService } from "../services/panel-factory.service";
import { PanelComponent } from "../components/panel/panel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgxColorsColor } from "../clases/color";
import { ConverterService } from "../services/converter.service";
import { formats } from "../helpers/formats";
import { Direction } from "../types/direction";

@Directive({
  selector: "[ngx-colors-trigger]",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxColorsTriggerDirective),
      multi: true,
    },
  ],
})
export class NgxColorsTriggerDirective
  implements ControlValueAccessor, OnDestroy
{
  readonly color = signal("");

  // This is used to set a custom palette of colors in the panel.
  // Keep it undefined by default so the panel can use its built-in default palette.
  readonly palette = input<Array<string> | Array<NgxColorsColor> | undefined>(
    undefined,
  );

  readonly dir = input<Direction>("ltr");
  readonly format = input<string>("");
  readonly formats = input<string[]>([]);
  readonly position = input<"top" | "bottom">("bottom");
  readonly hideTextInput = input<boolean>(false);
  readonly hideColorPicker = input<boolean>(false);
  readonly attachTo = input<string | undefined>(undefined);
  readonly overlayClassName = input<string | undefined>(undefined);
  readonly colorPickerControls = input<"default" | "only-alpha" | "no-alpha">(
    "default",
  );
  readonly acceptLabel = input<string>("ACCEPT");
  readonly cancelLabel = input<string>("CANCEL");
  // This event is trigger every time the selected color change
  readonly change = output<string>();
  // This event is trigger every time the user change the color using the panel
  readonly input = output<string>();
  // This event is trigger every time the user change the color using the panel
  readonly slider = output<string>();
  readonly close = output<string>();
  readonly open = output<string>();

  @HostListener("click") onClick() {
    this.openPanel();
  }

  readonly triggerRef = inject(ElementRef);
  readonly panelFactory = inject(PanelFactoryService);
  readonly service = inject(ConverterService);

  panelRef: ComponentRef<PanelComponent> | undefined;
  isDisabled: boolean = false;

  onTouchedCallback: () => void = () => {};
  onChangeCallback: (_: any) => void = () => {};

  public ngOnDestroy(): void {
    if (this.panelRef) {
      this.panelFactory.removePanel();
    }
  }

  public openPanel() {
    if (!this.isDisabled) {
      this.panelRef = this.panelFactory.createPanel(
        this.attachTo(),
        this.overlayClassName(),
      );
      this.panelRef.instance.iniciate({
        triggerInstance: this,
        triggerElementRef: this.triggerRef,
        color: this.color(),
        palette: this.palette(),
        format: this.format(),
        hideTextInput: this.hideTextInput(),
        hideColorPicker: this.hideColorPicker(),
        acceptLabel: this.acceptLabel(),
        cancelLabel: this.cancelLabel(),
        colorPickerControls: this.colorPickerControls(),
        position: this.position(),
        userFormats: this.formats(),
        dir: this.dir(),
      });
    }
    this.open.emit(this.color());
  }

  public closePanel() {
    this.panelFactory.removePanel();
    this.onTouchedCallback();
    this.close.emit(this.color());
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.triggerRef.nativeElement.style.opacity = isDisabled ? 0.5 : 1;
  }

  public setColor(color: string, previewColor = "") {
    this.writeValue(color);
    const currentColor = this.color();
    this.onChangeCallback(currentColor);

    const outputColor =
      currentColor.startsWith("cmyk") && previewColor
        ? previewColor
        : currentColor;

    this.change.emit(outputColor);
    this.input.emit(currentColor);
  }

  public sliderChange(color: string) {
    this.slider.emit(color);
  }

  get value(): string {
    return this.color();
  }

  set value(value: string) {
    this.setColor(value);
  }

  writeValue(value: string | undefined) {
    if (value !== this.color()) {
      const format = this.format();
      if (format) {
        let localFormat = formats.indexOf(format.toLowerCase());
        value = this.service.stringToFormat(value ?? "", localFormat);
      }
      this.color.set(value ?? "");
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
