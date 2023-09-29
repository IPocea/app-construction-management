import { Component, Input, OnInit } from '@angular/core';
import { ProjectDetailsService } from '@services';
import { take } from 'rxjs';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  @Input() pdfSrc: any;
  constructor() {}

  ngOnInit(): void {
    
  }

}
