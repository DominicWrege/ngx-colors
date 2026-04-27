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
} from "@angular/core";
import { PanelFactoryService } from "../services/panel-factory.service";
import { PanelComponent } from "../components/panel/panel.component";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgxColorsColor } from "../clases/color";
import { ConverterService } from "../services/converter.service";
import { formats } from "../helpers/formats";
import { ColorFormats } from "../enums/formats";
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
  //Main input/output of the color picker
  // @Input() color = '#000000';
  // @Output() colorChange:EventEmitter<string> = new EventEmitter<string>();

  readonly color = signal("");

  //This defines the type of animation for the palatte.(slide-in | popup)
  readonly colorsAnimation = input<"slide-in" | "popup">("slide-in");

  //This is used to set a custom palette of colors in the panel;
  readonly palette = input<Array<string> | Array<NgxColorsColor>>([]);

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
  constructor(
    private triggerRef: ElementRef,
    private panelFactory: PanelFactoryService,
    private service: ConverterService,
  ) {}

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
      this.panelRef.instance.iniciate(
        this,
        this.triggerRef,
        this.color(),
        this.palette(),
        this.colorsAnimation(),
        this.format(),
        this.hideTextInput(),
        this.hideColorPicker(),
        this.acceptLabel(),
        this.cancelLabel(),
        this.colorPickerControls(),
        this.position(),
        this.formats(),
        this.dir(),
      );
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
    this.writeValue(color, previewColor);
    this.onChangeCallback(color);
    this.input.emit(color);
  }

  public sliderChange(color: string) {
    this.slider.emit(color);
  }

  get value(): string {
    return this.color();
  }

  set value(value: string) {
    this.setColor(value);
    this.onChangeCallback(value);
  }

  writeValue(value: string | undefined, previewColor = "") {
    if (value !== this.color()) {
      const format = this.format();
      if (format) {
        let localFormat = formats.indexOf(format.toLowerCase());
        value = this.service.stringToFormat(value ?? "", localFormat);
      }
      this.color.set(value ?? "");

      let isCmyk = false;
      if (value && value.startsWith("cmyk")) {
        isCmyk = true;
        if (!previewColor) {
          previewColor = this.service.stringToFormat(value, ColorFormats.RGBA);
        }
      }

      this.change.emit(isCmyk ? previewColor : value);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
