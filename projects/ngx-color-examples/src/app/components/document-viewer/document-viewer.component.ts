import { Component, OnInit, Input } from "@angular/core";
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

  @Input() documents: any;

  ngOnInit(): void {
    for (let i = 0; i < this.documents.length; i++) {
      this.http
        .get(this.documents[i].file, { responseType: "text" })
        .subscribe((data) => {
          this.documents[i]["content"] = data;
        });
    }
  }
}
