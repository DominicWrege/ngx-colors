import {
  Component,
  OnInit,
  ElementRef,
  viewChild,
  inject,
  signal,
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { examples } from "./const/examples";
import { snippets } from "./const/snippets";
import { api } from "./const/api";
import { UntypedFormGroup, UntypedFormControl } from "@angular/forms";

import {
  ChildrenOutletContexts,
  Router,
  RoutesRecognized,
} from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  host: {
    "[style.display]": "'block'",
  },
  standalone: false,
})
export class AppComponent implements OnInit {
  title = "ngx-color-examples";
  rightColor = "#42A5F5";
  leftColor = "#C0CA33";
  gradient = signal("");

  public http = inject(HttpClient);
  private contexts = inject(ChildrenOutletContexts);
  private router = inject(Router);

  readonly menuView = viewChild<ElementRef>("tabmenu");

  getRouteAnimationData() {
    return this.contexts.getContext("primary")?.route?.snapshot?.data?.[
      "tabIndex"
    ];
  }

  links = [
    { text: "OVERVIEW", url: "/overview" },
    { text: "API", url: "/api" },
    { text: "EXAMPLES", url: "/examples" },
    { text: "CHANGELOG", url: "/changelog" },
  ];
  activeLink: string | undefined = undefined;

  testForm = new UntypedFormGroup({
    testCtrl: new UntypedFormControl(""),
  });

  customPalette = [
    "#C0CA33",
    "#42A5F5",
    "#455a64",
    "#c2185b",
    "#ab47bc",
    "#26a69a",
    "#00acc1",
  ];
  colors = [
    "#C0CA33",
    "#42A5F5",
    "#455a64",
    "#c2185b",
    "#ab47bc",
    "#26a69a",
    "#00acc1",
  ];

  snippets = snippets;
  examples = examples;
  api = api;
  colorFormControl = new UntypedFormControl("#c2185b");

  navbar = false;
  versions: any[] = [];

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof RoutesRecognized) {
        this.activeLink = event.url;
      }
    });
    this.randomBrackground();
    this.updateGradient();
  }

  randomBrackground() {
    let index = this.randomInt(0, this.colors.length - 1);
    this.leftColor = this.colors[index];
    this.colors.splice(index, 1);
    index = this.randomInt(0, this.colors.length - 1);
    this.rightColor = this.colors[index];
  }

  randomInt(min: number, max: number) {
    return min + Math.floor((max - min) * Math.random());
  }

  updateGradient() {
    this.gradient.set(
      `linear-gradient(45deg, ${this.leftColor} 0%, ${this.rightColor} 100%)`,
    );
  }

  scrollIntoView() {
    this.menuView()?.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  log(event: string) {
    console.log(event);
  }
}
