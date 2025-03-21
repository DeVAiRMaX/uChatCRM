import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from './../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../../assets/module/company-details.interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-activity-dialog',
  standalone: true,
  imports: [SharedModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{data.activity ? 'Aktivität bearbeiten' : 'Neue Aktivität'}}</h2>
    
    <form [formGroup]="activityForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-content">
          <mat-form-field appearance="outline">
            <mat-label>Typ</mat-label>
            <mat-select formControlName="typ">
              <mat-option value="anruf">Anruf</mat-option>
              <mat-option value="meeting">Meeting</mat-option>
              <mat-option value="email">E-Mail</mat-option>
              <mat-option value="notiz">Notiz</mat-option>
            </mat-select>
            <mat-error *ngIf="activityForm.get('typ')?.hasError('required')">
              Typ ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Datum & Zeit</mat-label>
            <input matInput [matDatepicker]="datePicker" formControlName="datum">
            <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
            <mat-error *ngIf="activityForm.get('datum')?.hasError('required')">
              Datum ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Kontaktperson</mat-label>
            <input matInput formControlName="kontaktPerson" placeholder="Name der Kontaktperson">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Beschreibung</mat-label>
            <textarea matInput formControlName="beschreibung" placeholder="Beschreibung der Aktivität" rows="3"></textarea>
            <mat-error *ngIf="activityForm.get('beschreibung')?.hasError('required')">
              Beschreibung ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Ergebnis</mat-label>
            <textarea matInput formControlName="ergebnis" placeholder="Ergebnis der Aktivität" rows="2"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!activityForm.valid || isLoading">
          <mat-icon>save</mat-icon>
          {{isLoading ? 'Wird gespeichert...' : 'Speichern'}}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
      padding: 8px 0;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class ActivityDialogComponent implements OnInit {
  activityForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      companyId: string;
      activity?: Activity;
    },
    private fb: FormBuilder
  ) {
    this.activityForm = this.fb.group({
      typ: ['', Validators.required],
      datum: [new Date(), Validators.required],
      kontaktPerson: [''],
      beschreibung: ['', Validators.required],
      ergebnis: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.activity) {
      this.activityForm.patchValue(this.data.activity);
    }
  }

  onSubmit(): void {
    if (this.activityForm.valid) {
      this.isLoading = true;
      const activityData = this.activityForm.value;
      
      if (this.data.activity?.id) {
        activityData.id = this.data.activity.id;
      }

      this.dialogRef.close(activityData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 