import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
  })

  export class ConfirmationDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    ) {}

    closeDialog(): void {
        this.dialogRef.close();
      }

    confirm() {
        this.dialogRef.close(true);
    }

    ngOnInit(): void { }

    
  }