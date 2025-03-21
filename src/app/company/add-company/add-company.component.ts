/**
 * @module AddCompanyComponent
 * @description Eine Angular-Komponente zur Erstellung neuer Unternehmen.
 * Diese Komponente stellt ein Formular bereit, mit dem Benutzer neue Unternehmen
 * in der Firestore-Datenbank anlegen können.
 */
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
  /** Formular-Gruppe für die Unternehmensdaten */
  companyForm: FormGroup;
  
  /** Instanz der Company-Klasse für das neue Unternehmen */
  newCompany: Company = new Company();
  
  /** Flag zur Anzeige des Lade-Status während des Speichervorgangs */
  isLoading = false;

  /**
   * Konstruktor der AddCompanyComponent
   * @param fb - FormBuilder-Service für die Erstellung des Formulars
   * @param dialogRef - Referenz auf den Dialog für das Schließen/Abbrechen
   * @param firestore - Firestore-Service für Datenbankoperationen
   */
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

  /**
   * Lifecycle-Hook, der bei der Initialisierung der Komponente aufgerufen wird
   */
  ngOnInit(): void {}

  /**
   * Verarbeitet das Absenden des Formulars
   * @returns Promise<void>
   * @throws Error wenn das Speichern in Firestore fehlschlägt
   */
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
