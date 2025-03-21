import { Component, Inject } from '@angular/core';
import { SharedModule } from './../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Company } from '../../../assets/module/addcompany.class';

@Component({
  selector: 'app-delete-company-dialog',
  standalone: true,
  imports: [SharedModule],
  template: `
    <h2 mat-dialog-title>Unternehmen löschen</h2>
    
    <mat-dialog-content>
      <p>Sind Sie sicher, dass Sie das Unternehmen <strong>{{data.company.name}}</strong> löschen möchten?</p>
      <p class="warning-text">
        <mat-icon color="warn">warning</mat-icon>
        Diese Aktion kann nicht rückgängig gemacht werden!
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Abbrechen</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">
        <mat-icon>delete_forever</mat-icon>
        Löschen
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .warning-text {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f44336;
      margin-top: 16px;
    }
    mat-dialog-content {
      min-width: 400px;
    }
  `]
})
export class DeleteCompanyDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
} 