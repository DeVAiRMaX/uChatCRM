import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared.module';
import { MatDialog } from '@angular/material/dialog';
import { AddCompanyComponent } from './add-company/add-company.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { DeleteCompanyDialogComponent } from './delete-company-dialog/delete-company-dialog.component';
import { Firestore, collection, onSnapshot, doc, deleteDoc, getDocs, CollectionReference, Query } from '@angular/fire/firestore';
import { Company } from '../../assets/module/addcompany.class';
import { Contact, Project, Activity } from '../../assets/module/company-details.interface';

interface CompanyStats {
  kontakte: number;
  projekte: number;
  aktivitaeten: number;
}

interface CompanyWithStats {
  id: string;
  name: string;
  branche: string;
  standort: string;
  telefon: string;
  email: string;
  stats: CompanyStats;
  toJson(): any;
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
  companies: CompanyWithStats[] = [];
  isLoading = true;

  constructor(
    private dialog: MatDialog,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  private async loadCompanies() {
    const companiesRef = collection(this.firestore, 'companies');
    
    onSnapshot(companiesRef, (snapshot) => {
      this.isLoading = true;

      // Für jedes Unternehmen Echtzeit-Listener erstellen
      snapshot.docs.forEach(doc => {
        const companyId = doc.id;
        const data = doc.data();

        // Echtzeit-Listener für Kontakte
        onSnapshot(
          collection(this.firestore, `companies/${companyId}/contacts`),
          (kontakteSnapshot) => {
            this.updateCompanyStats(companyId, data, {
              kontakte: kontakteSnapshot.size,
              projekte: this.findCompanyStats(companyId)?.projekte || 0,
              aktivitaeten: this.findCompanyStats(companyId)?.aktivitaeten || 0
            });
          }
        );

        // Echtzeit-Listener für Projekte
        onSnapshot(
          collection(this.firestore, `companies/${companyId}/projects`),
          (projekteSnapshot) => {
            this.updateCompanyStats(companyId, data, {
              kontakte: this.findCompanyStats(companyId)?.kontakte || 0,
              projekte: projekteSnapshot.size,
              aktivitaeten: this.findCompanyStats(companyId)?.aktivitaeten || 0
            });
          }
        );

        // Echtzeit-Listener für Aktivitäten
        onSnapshot(
          collection(this.firestore, `companies/${companyId}/activities`),
          (aktivitaetenSnapshot) => {
            this.updateCompanyStats(companyId, data, {
              kontakte: this.findCompanyStats(companyId)?.kontakte || 0,
              projekte: this.findCompanyStats(companyId)?.projekte || 0,
              aktivitaeten: aktivitaetenSnapshot.size
            });
          }
        );
      });

      this.isLoading = false;
    }, (error) => {
      console.error('Fehler beim Beobachten der Unternehmen:', error);
      this.isLoading = false;
    });
  }

  private findCompanyStats(companyId: string): CompanyStats | undefined {
    return this.companies.find(c => c.id === companyId)?.stats;
  }

  private updateCompanyStats(companyId: string, companyData: any, stats: CompanyStats) {
    const existingCompanyIndex = this.companies.findIndex(c => c.id === companyId);
    
    const updatedCompany: CompanyWithStats = {
      id: companyId,
      name: companyData['name'],
      branche: companyData['branche'],
      standort: companyData['standort'],
      telefon: companyData['telefon'],
      email: companyData['email'],
      stats: stats,
      toJson() {
        return {
          name: this.name,
          branche: this.branche,
          standort: this.standort,
          telefon: this.telefon,
          email: this.email
        };
      }
    };

    if (existingCompanyIndex !== -1) {
      // Unternehmen existiert bereits, aktualisiere es
      this.companies[existingCompanyIndex] = updatedCompany;
    } else {
      // Neues Unternehmen, füge es hinzu
      this.companies.push(updatedCompany);
    }

    // Trigger Change Detection
    this.companies = [...this.companies];
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

  openEditCompanyDialog(company: CompanyWithStats) {
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

  openDetailsDialog(company: CompanyWithStats) {
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

  async deleteCompany(company: CompanyWithStats): Promise<void> {
    const dialogRef = this.dialog.open(DeleteCompanyDialogComponent, {
      data: { company }
    });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        try {
          const companyRef = doc(this.firestore, 'companies', company.id);

          // Lösche alle Kontakte
          const kontakteRef = collection(this.firestore, `companies/${company.id}/contacts`);
          const kontakteSnapshot = await getDocs(kontakteRef);
          const kontaktePromises = kontakteSnapshot.docs.map(doc => 
            deleteDoc(doc.ref)
          );
          await Promise.all(kontaktePromises);

          // Lösche alle Projekte
          const projekteRef = collection(this.firestore, `companies/${company.id}/projects`);
          const projekteSnapshot = await getDocs(projekteRef);
          const projektePromises = projekteSnapshot.docs.map(doc => 
            deleteDoc(doc.ref)
          );
          await Promise.all(projektePromises);

          // Lösche alle Aktivitäten
          const aktivitaetenRef = collection(this.firestore, `companies/${company.id}/activities`);
          const aktivitaetenSnapshot = await getDocs(aktivitaetenRef);
          const aktivitaetenPromises = aktivitaetenSnapshot.docs.map(doc => 
            deleteDoc(doc.ref)
          );
          await Promise.all(aktivitaetenPromises);

          // Lösche das Unternehmen selbst
          await deleteDoc(companyRef);

          // Entferne das Unternehmen aus dem lokalen Array
          const index = this.companies.findIndex(c => c.id === company.id);
          if (index !== -1) {
            this.companies.splice(index, 1);
            // Trigger Change Detection
            this.companies = [...this.companies];
          }

          console.log('Unternehmen und alle zugehörigen Daten wurden erfolgreich gelöscht');
        } catch (error) {
          console.error('Fehler beim Löschen des Unternehmens:', error);
        }
      }
    });
  }
}
