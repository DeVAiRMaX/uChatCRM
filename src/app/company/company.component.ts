import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './../shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AddCompanyComponent } from './add-company/add-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { DeleteCompanyDialogComponent } from './delete-company-dialog/delete-company-dialog.component';
import { Firestore, collection, onSnapshot, doc, deleteDoc } from '@angular/fire/firestore';
import { Company } from '../../assets/module/addcompany.class';

interface CompanyWithId extends Company {
  id: string;
}

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SharedModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  companies: CompanyWithId[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  private loadCompanies() {
    const companiesRef = collection(this.firestore, 'companies');
    
    onSnapshot(companiesRef, (snapshot) => {
      this.companies = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          stats: data['stats'] || {
            kontakte: 0,
            projekte: 0,
            aktivitaeten: 0
          }
        } as CompanyWithId;
      });
      this.isLoading = false;
    }, (error) => {
      console.error('Fehler beim Laden der Unternehmen:', error);
      this.isLoading = false;
    });
  }

  openAddCompanyDialog() {
    const dialogRef = this.dialog.open(AddCompanyComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Dialog wurde mit einem Ergebnis geschlossen
        console.log('Neues Unternehmen wurde hinzugefügt:', result);
      }
    });
  }

  openEditCompanyDialog(company: CompanyWithId) {
    const dialogRef = this.dialog.open(EditCompanyComponent, {
      data: {
        company: company,
        docId: company.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Unternehmen wurde aktualisiert:', result);
      }
    });
  }

  openDetailsDialog(company: CompanyWithId) {
    const dialogRef = this.dialog.open(CompanyDetailsComponent, {
      data: {
        company: company,
        docId: company.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'edit') {
        this.openEditCompanyDialog(company);
      }
    });
  }

  async deleteCompany(company: CompanyWithId): Promise<void> {
    const dialogRef = this.dialog.open(DeleteCompanyDialogComponent, {
      data: { company }
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        try {
          const companyRef = doc(this.firestore, 'companies', company.id);
          await deleteDoc(companyRef);
          console.log('Unternehmen wurde erfolgreich gelöscht');
        } catch (error) {
          console.error('Fehler beim Löschen des Unternehmens:', error);
        }
      }
    });
  }
}
