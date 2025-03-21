import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from './../../shared.module';
import { Company } from '../../../assets/module/addcompany.class';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [SharedModule],
  template: `
    <h2 mat-dialog-title>Unternehmen bearbeiten</h2>
    
    <mat-dialog-content>
      <form [formGroup]="companyForm" class="company-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Unternehmensname">
          <mat-error *ngIf="companyForm.get('name')?.hasError('required')">Name ist erforderlich</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Branche</mat-label>
          <input matInput formControlName="branche" placeholder="Branche">
          <mat-error *ngIf="companyForm.get('branche')?.hasError('required')">Branche ist erforderlich</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Standort</mat-label>
          <input matInput formControlName="standort" placeholder="Standort">
          <mat-error *ngIf="companyForm.get('standort')?.hasError('required')">Standort ist erforderlich</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefon</mat-label>
          <input matInput formControlName="telefon" placeholder="Telefonnummer">
          <mat-error *ngIf="companyForm.get('telefon')?.hasError('required')">Telefon ist erforderlich</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-Mail</mat-label>
          <input matInput formControlName="email" placeholder="E-Mail-Adresse">
          <mat-error *ngIf="companyForm.get('email')?.hasError('required')">E-Mail ist erforderlich</mat-error>
          <mat-error *ngIf="companyForm.get('email')?.hasError('email')">Ungültige E-Mail-Adresse</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Abbrechen</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!companyForm.valid || isLoading">
        <mat-icon>save</mat-icon>
        {{ isLoading ? 'Wird gespeichert...' : 'Speichern' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .company-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
      min-width: 400px;
    }
    mat-form-field {
      width: 100%;
    }
  `]
})
export class EditCompanyComponent implements OnInit {
  companyForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private dialogRef: MatDialogRef<EditCompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company, docId: string }
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      branche: ['', Validators.required],
      standort: ['', Validators.required],
      telefon: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Formular mit den bestehenden Daten füllen
    this.companyForm.patchValue({
      name: this.data.company.name,
      branche: this.data.company.branche,
      standort: this.data.company.standort,
      telefon: this.data.company.telefon,
      email: this.data.company.email
    });
  }

  async onSubmit(): Promise<void> {
    if (this.companyForm.valid) {
      try {
        this.isLoading = true;
        const updatedCompany = {
          ...this.data.company,
          ...this.companyForm.value
        };
        
        const companyRef = doc(this.firestore, 'companies', this.data.docId);
        await updateDoc(companyRef, updatedCompany);
        
        this.dialogRef.close(updatedCompany);
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Unternehmens:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 