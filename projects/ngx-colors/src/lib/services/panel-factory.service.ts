import {
  Injectable,
  Injector,
  ApplicationRef,
  EmbeddedViewRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
  inject,
} from "@angular/core";

import { PanelComponent } from "../components/panel/panel.component";
import { OVERLAY_STYLES } from "./overlay-styles";

@Injectable()
export class PanelFactoryService {
  private readonly applicationRef = inject(ApplicationRef);
  private readonly injector = inject(Injector);
  private readonly environmentInjector = inject(EnvironmentInjector);

  componentRef!: ComponentRef<PanelComponent>;
  overlay!: HTMLDivElement;

  createPanel(
    attachTo: string | undefined,
    overlayClassName: string | undefined,
  ): ComponentRef<PanelComponent> {
    if (this.componentRef != undefined) {
      this.removePanel();
    }
    this.componentRef = createComponent(PanelComponent, {
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector,
    });
    this.applicationRef.attachView(this.componentRef.hostView);
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    this.overlay = document.createElement("div");
    this.overlay.id = "ngx-colors-overlay";
    this.overlay.classList.add("ngx-colors-overlay");
    if (overlayClassName) {
      this.overlay.classList.add(overlayClassName);
    }
    Object.keys(OVERLAY_STYLES).forEach((attr) => {
      this.overlay.style.setProperty(
        attr,
        String(OVERLAY_STYLES[attr as keyof typeof OVERLAY_STYLES]),
      );
    });
    if (attachTo) {
      const attachElement = document.getElementById(attachTo);
      if (attachElement) {
        attachElement.appendChild(this.overlay);
      } else {
        document.body.appendChild(this.overlay);
      }
    } else {
      document.body.appendChild(this.overlay);
    }
    this.overlay.appendChild(domElem);

    return this.componentRef;
  }

  removePanel() {
    this.applicationRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.overlay.remove();
  }
}
