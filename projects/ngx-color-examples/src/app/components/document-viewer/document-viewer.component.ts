import { Component, OnInit, input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { Highlight } from "ngx-highlightjs";

@Component({
  selector: "app-document-viewer",
  templateUrl: "./document-viewer.component.html",
  styleUrls: ["./document-viewer.component.scss"],
  imports: [MatTabGroup, MatTab, Highlight],
})
export class DocumentViewerComponent implements OnInit {
  constructor(private http: HttpClient) {}

  readonly documents = input<any>(undefined);

  ngOnInit(): void {
    const documents = this.documents();
    if (!Array.isArray(documents) || documents.length === 0) {
      return;
    }

    documents.forEach((document) => {
      if (!document?.file) {
        return;
      }

      this.http
        .get(document.file, { responseType: "text" })
        .subscribe((data) => {
          document.content = data;
        });
    });
  }
}
