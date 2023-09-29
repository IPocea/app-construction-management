import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, type: string): void {
    this.snackBar.open(message, null, {
      duration: 2000,
      panelClass: [type],
    });
  }

  info(message: string): void {
    this.openSnackBar(message, 'info');
  }

  error(message: string): void {
    this.openSnackBar(message, 'error');
  }
}
