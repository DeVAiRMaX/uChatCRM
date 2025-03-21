import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from './../../shared.module';
import { Company } from '../../../assets/module/addcompany.class';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent implements OnInit {
  companyForm: FormGroup;
  newCompany: Company = new Company();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddCompanyComponent>,
    private firestore: Firestore
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      branche: ['', Validators.required],
      standort: ['', Validators.required],
      telefon: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.companyForm.valid) {
      try {
        this.isLoading = true;
        Object.assign(this.newCompany, this.companyForm.value);
        
        // Speichern der Firma in Firestore
        await addDoc(collection(this.firestore, 'companies'), this.newCompany.toJson());
        
        this.dialogRef.close(this.newCompany);
      } catch (error) {
        console.error('Fehler beim Speichern der Firma:', error);
        // Hier könnte man noch eine Fehlerbehandlung hinzufügen
      } finally {
        this.isLoading = false;
      }
    }
  }
}
