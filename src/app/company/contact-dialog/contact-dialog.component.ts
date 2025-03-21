import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from './../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../../assets/module/company-details.interface';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [SharedModule],
  template: `
    <h2 mat-dialog-title>{{data.contact ? 'Kontakt bearbeiten' : 'Neuer Kontakt'}}</h2>
    
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-content">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name" placeholder="Name des Kontakts">
            <mat-error *ngIf="contactForm.get('name')?.hasError('required')">
              Name ist erforderlich
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Position</mat-label>
            <input matInput formControlName="position" placeholder="Position im Unternehmen">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>E-Mail</mat-label>
            <input matInput formControlName="email" placeholder="E-Mail-Adresse">
            <mat-error *ngIf="contactForm.get('email')?.hasError('email')">
              Bitte geben Sie eine gültige E-Mail-Adresse ein
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Telefon</mat-label>
            <input matInput formControlName="phone" placeholder="Telefonnummer">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Notizen</mat-label>
            <textarea matInput formControlName="notes" placeholder="Zusätzliche Notizen" rows="3"></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Abbrechen</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!contactForm.valid || isLoading">
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
export class ContactDialogComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      companyId: string;
      contact?: Contact;
    },
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      position: [''],
      email: ['', [Validators.email]],
      phone: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.contact) {
      this.contactForm.patchValue({
        name: this.data.contact.name,
        position: this.data.contact.position,
        email: this.data.contact.email,
        phone: this.data.contact.phone,
        notes: this.data.contact.notes
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const contactData: Contact = {
        ...this.contactForm.value
      };
      this.dialogRef.close(contactData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 