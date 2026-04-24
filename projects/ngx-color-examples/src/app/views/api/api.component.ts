import { Component } from "@angular/core";
import { api } from "../../const/api";
import { snippets } from "../../const/snippets";
import { Highlight } from "ngx-highlightjs";

@Component({
    selector: "app-api-example",
    templateUrl: "./api.component.html",
    styleUrls: ["./api.component.scss"],
    imports: [Highlight]
})
export class ApiComponent {
  constructor() {}
  api = api;
  snippets = snippets;
}
