import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HeaderComponent } from '@shared/components/header/header.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { AppTranslationLazyModule } from 'app/app-translation-lazy.module';
import { MatTableComponent } from '@shared/table/mat-table/mat-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CustomDatePipe, WordSeparatorPipe } from '@shared/pipes/index';
import { NgChartsModule } from 'ng2-charts';
import { PieChartComponent } from '@shared/charts/pie-chart/pie-chart.component';
import { NgChartsConfiguration } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer/pdf-viewer.component';
import { DataCostsEditDialogComponent } from '@shared/components/data-costs-edit-dialog-component/data-costs-edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProjectEditDialogComponent } from '@shared/components/project-edit/project-edit.component';
import { DocumentsComponent } from '@shared/components/documents/documents.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { DragAndDropDirective } from '../directives/drag-and-drop-.directive';
import { UploadFileComponent } from '@shared/components/upload-file/upload-file.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ImageDocumentComponent } from '@shared/components/image-document/image-document/image-document.component';
import { DshSettingsComponent } from '@shared/components/dsh-settings/dsh-settings.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddEditMenuCategoryDialogComponent } from '@shared/components/add-edit-menu-category-dialog/add-edit-menu-category-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    AppTranslationLazyModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgChartsModule,
    PdfViewerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatRippleModule,
    MatCheckboxModule,
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    MatTableComponent,
    WordSeparatorPipe,
    CustomDatePipe,
    PieChartComponent,
    PdfViewerComponent,
    DataCostsEditDialogComponent,
    ProjectEditDialogComponent,
    DocumentsComponent,
    DragAndDropDirective,
    UploadFileComponent,
    ConfirmationDialogComponent,
    ImageDocumentComponent,
    DshSettingsComponent,
    AddEditMenuCategoryDialogComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MatTableComponent,
    CommonModule,
    FormsModule,
    AppTranslationLazyModule,
    WordSeparatorPipe,
    CustomDatePipe,
    PieChartComponent,
    PdfViewerComponent,
    DataCostsEditDialogComponent,
    DocumentsComponent,
    UploadFileComponent,
    ConfirmationDialogComponent,
    ImageDocumentComponent,
    DshSettingsComponent,
    AddEditMenuCategoryDialogComponent,
  ],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
})
export class SharedModule {}
