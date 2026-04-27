import {
  Directive,
  HostListener,
  ElementRef,
  input,
  output,
} from "@angular/core";

@Directive({ selector: "[slider]" })
export class SliderDirective {
  private listenerMove: any;
  private listenerStop: any;

  readonly rgX = input<number | undefined>(undefined);
  readonly rgY = input<number | undefined>(undefined);

  readonly slider = input<string>("");

  readonly dragEnd = output();
  readonly dragStart = output();

  readonly newValue = output<any>();

  @HostListener("mousedown", ["$event"]) mouseDown(event: any): void {
    this.start(event);
  }

  @HostListener("touchstart", ["$event"]) touchStart(event: any): void {
    this.start(event);
  }

  constructor(private elRef: ElementRef) {
    this.listenerMove = (event: any) => this.move(event);

    this.listenerStop = () => this.stop();
  }

  private move(event: any): void {
    event.preventDefault();

    this.setCursor(event);
  }

  private start(event: any): void {
    this.setCursor(event);

    event.stopPropagation();

    document.addEventListener("mouseup", this.listenerStop);
    document.addEventListener("touchend", this.listenerStop);
    document.addEventListener("mousemove", this.listenerMove);
    document.addEventListener("touchmove", this.listenerMove);

    this.dragStart.emit();
  }

  private stop(): void {
    document.removeEventListener("mouseup", this.listenerStop);
    document.removeEventListener("touchend", this.listenerStop);
    document.removeEventListener("mousemove", this.listenerMove);
    document.removeEventListener("touchmove", this.listenerMove);

    this.dragEnd.emit();
  }

  private getX(event: any): number {
    const position = this.elRef.nativeElement.getBoundingClientRect();

    const pageX =
      event.pageX !== undefined ? event.pageX : event.touches[0].pageX;

    return pageX - position.left - window.pageXOffset;
  }

  private getY(event: any): number {
    const position = this.elRef.nativeElement.getBoundingClientRect();

    const pageY =
      event.pageY !== undefined ? event.pageY : event.touches[0].pageY;

    return pageY - position.top - window.pageYOffset;
  }

  private isRtl(): boolean {
    const host = this.elRef.nativeElement as HTMLElement;
    const nearestDir = host.closest("[dir]")?.getAttribute("dir");

    if (nearestDir) {
      return nearestDir.toLowerCase() === "rtl";
    }

    return getComputedStyle(host).direction === "rtl";
  }

  private setCursor(event: any): void {
    const width = this.elRef.nativeElement.offsetWidth;
    const height = this.elRef.nativeElement.offsetHeight;

    const x = Math.max(0, Math.min(this.getX(event), width));
    const y = Math.max(0, Math.min(this.getY(event), height));

    const rgX = this.rgX();
    const rgY = this.rgY();
    const normalizedX = this.isRtl() ? 1 - x / width : x / width;

    const hasX = rgX !== undefined;
    const hasY = rgY !== undefined;

    if (hasX && hasY) {
      this.newValue.emit({
        s: normalizedX,
        v: 1 - y / height,
        rgX: rgX,
        rgY: rgY,
      });
    } else if (!hasX && hasY) {
      this.newValue.emit({ v: y / height, rgY: rgY });
    } else if (hasX && !hasY) {
      this.newValue.emit({ v: normalizedX, rgX: rgX });
    }
  }
}
