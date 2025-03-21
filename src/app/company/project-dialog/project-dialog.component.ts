import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from './../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../../assets/module/company-details.interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [SharedModule, MatSelectModule],
  template: `
    <h2 mat-dialog-title>{{data.project ? 'Projekt bearbeiten' : 'Neues Projekt'}}</h2>
    
    <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-content">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Name des Projekts">
            <mat-error *ngIf="projectForm.get('name')?.hasError('required')">
              Name ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="geplant">Geplant</mat-option>
              <mat-option value="aktiv">Aktiv</mat-option>
              <mat-option value="pausiert">Pausiert</mat-option>
              <mat-option value="abgeschlossen">Abgeschlossen</mat-option>
            </mat-select>
            <mat-error *ngIf="projectForm.get('status')?.hasError('required')">
              Status ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Startdatum</mat-label>
            <input matInput [matDatepicker]="startPicker" formControlName="startDatum">
            <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
            <mat-datepicker #startPicker></mat-datepicker>
            <mat-error *ngIf="projectForm.get('startDatum')?.hasError('required')">
              Startdatum ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Enddatum</mat-label>
            <input matInput [matDatepicker]="endPicker" formControlName="endDatum">
            <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
            <mat-datepicker #endPicker></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Budget (€)</mat-label>
            <input matInput type="number" formControlName="budget" placeholder="Budget in Euro">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Beschreibung</mat-label>
            <textarea matInput formControlName="beschreibung" placeholder="Projektbeschreibung" rows="3"></textarea>
            <mat-error *ngIf="projectForm.get('beschreibung')?.hasError('required')">
              Beschreibung ist erforderlich
            </mat-error>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!projectForm.valid || isLoading">
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
export class ProjectDialogComponent implements OnInit {
  projectForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      companyId: string;
      project?: Project;
    },
    private fb: FormBuilder
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      status: ['geplant', Validators.required],
      startDatum: [new Date(), Validators.required],
      endDatum: [null],
      budget: [null],
      beschreibung: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.project) {
      this.projectForm.patchValue(this.data.project);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading = true;
      const projectData = this.projectForm.value;
      
      if (this.data.project?.id) {
        projectData.id = this.data.project.id;
      }

      this.dialogRef.close(projectData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 