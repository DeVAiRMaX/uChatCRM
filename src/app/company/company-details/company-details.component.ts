import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from './../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Company } from '../../../assets/module/addcompany.class';
import { Contact, Project, Activity } from '../../../assets/module/company-details.interface';
import { Firestore, doc, collection, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [
    SharedModule,
    MatTabsModule,
    MatExpansionModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.company.name}}</h2>
    
    <mat-dialog-content>
      <div class="company-details">
        <!-- Hauptinformationen -->
        <section class="info-section">
          <h3>Unternehmensinformationen</h3>
          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon>business</mat-icon>
              <div matListItemTitle>Branche</div>
              <div matListItemLine>{{data.company.branche}}</div>
            </mat-list-item>
            
            <mat-list-item>
              <mat-icon matListItemIcon>location_on</mat-icon>
              <div matListItemTitle>Standort</div>
              <div matListItemLine>{{data.company.standort}}</div>
            </mat-list-item>

            <mat-list-item>
              <mat-icon matListItemIcon>phone</mat-icon>
              <div matListItemTitle>Telefon</div>
              <div matListItemLine>{{data.company.telefon}}</div>
            </mat-list-item>

            <mat-list-item>
              <mat-icon matListItemIcon>email</mat-icon>
              <div matListItemTitle>E-Mail</div>
              <div matListItemLine>{{data.company.email}}</div>
            </mat-list-item>
          </mat-list>
        </section>

        <!-- Tabs für Details -->
        <mat-tab-group>
          <!-- Kontakte Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">people</mat-icon>
              Kontakte ({{contacts.length}})
            </ng-template>
            
            <div class="tab-content">
              <button mat-raised-button color="primary" (click)="openAddContactDialog()">
                <mat-icon>person_add</mat-icon>
                Kontakt hinzufügen
              </button>

              <mat-accordion>
                <mat-expansion-panel *ngFor="let contact of contacts">
                  <mat-expansion-panel-header>
                    <mat-panel-title>{{contact.name}}</mat-panel-title>
                    <mat-panel-description>{{contact.position}}</mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="contact-details">
                    <p><mat-icon>email</mat-icon> {{contact.email}}</p>
                    <p><mat-icon>phone</mat-icon> {{contact.phone}}</p>
                    <p *ngIf="contact.notes"><mat-icon>notes</mat-icon> {{contact.notes}}</p>
                  </div>

                  <mat-action-row>
                    <button mat-button color="warn" (click)="deleteContact(contact)">
                      <mat-icon>delete</mat-icon> Löschen
                    </button>
                    <button mat-button color="primary" (click)="editContact(contact)">
                      <mat-icon>edit</mat-icon> Bearbeiten
                    </button>
                  </mat-action-row>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </mat-tab>

          <!-- Projekte Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">assignment</mat-icon>
              Projekte ({{projects.length}})
            </ng-template>
            
            <div class="tab-content">
              <button mat-raised-button color="primary" (click)="openAddProjectDialog()">
                <mat-icon>add</mat-icon>
                Projekt hinzufügen
              </button>

              <mat-accordion>
                <mat-expansion-panel *ngFor="let project of projects">
                  <mat-expansion-panel-header>
                    <mat-panel-title>{{project.name}}</mat-panel-title>
                    <mat-panel-description>
                      <mat-chip-listbox>
                        <mat-chip [color]="getStatusColor(project.status)" selected>
                          {{project.status}}
                        </mat-chip>
                      </mat-chip-listbox>
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="project-details">
                    <p><strong>Start:</strong> {{project.startDatum | date}}</p>
                    <p *ngIf="project.endDatum"><strong>Ende:</strong> {{project.endDatum | date}}</p>
                    <p *ngIf="project.budget"><strong>Budget:</strong> {{project.budget | currency:'EUR'}}</p>
                    <p>{{project.beschreibung}}</p>
                  </div>

                  <mat-action-row>
                    <button mat-button color="warn" (click)="deleteProject(project)">
                      <mat-icon>delete</mat-icon> Löschen
                    </button>
                    <button mat-button color="primary" (click)="editProject(project)">
                      <mat-icon>edit</mat-icon> Bearbeiten
                    </button>
                  </mat-action-row>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </mat-tab>

          <!-- Aktivitäten Tab -->
          <mat-tab>
            <ng-template mat-tab-label>
              <mat-icon class="tab-icon">event</mat-icon>
              Aktivitäten ({{activities.length}})
            </ng-template>
            
            <div class="tab-content">
              <button mat-raised-button color="primary" (click)="openAddActivityDialog()">
                <mat-icon>add</mat-icon>
                Aktivität hinzufügen
              </button>

              <mat-accordion>
                <mat-expansion-panel *ngFor="let activity of activities">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon [class]="getActivityIcon(activity.typ)">
                        {{getActivityIcon(activity.typ)}}
                      </mat-icon>
                      {{activity.typ}}
                    </mat-panel-title>
                    <mat-panel-description>
                      {{activity.datum | date:'short'}}
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div class="activity-details">
                    <p>{{activity.beschreibung}}</p>
                    <p *ngIf="activity.kontaktPerson"><strong>Kontakt:</strong> {{activity.kontaktPerson}}</p>
                    <p *ngIf="activity.ergebnis"><strong>Ergebnis:</strong> {{activity.ergebnis}}</p>
                  </div>

                  <mat-action-row>
                    <button mat-button color="warn" (click)="deleteActivity(activity)">
                      <mat-icon>delete</mat-icon> Löschen
                    </button>
                    <button mat-button color="primary" (click)="editActivity(activity)">
                      <mat-icon>edit</mat-icon> Bearbeiten
                    </button>
                  </mat-action-row>
                </mat-expansion-panel>
              </mat-accordion>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Schließen</button>
      <button mat-raised-button color="primary" (click)="onEdit()">
        <mat-icon>edit</mat-icon>
        Unternehmen bearbeiten
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .company-details {
      padding: 16px 0;
      min-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
    }
    
    .info-section, .stats-section {
      margin-bottom: 24px;
    }

    h3 {
      color: #666;
      margin-bottom: 16px;
      font-weight: 500;
    }

    .tab-content {
      padding: 16px 0;
    }

    .tab-icon {
      margin-right: 8px;
    }

    mat-accordion {
      margin-top: 16px;
    }

    .contact-details, .project-details, .activity-details {
      padding: 8px 0;
    }

    .contact-details p, .project-details p, .activity-details p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 4px 0;
    }

    mat-icon {
      color: #666;
    }

    button {
      margin-right: 8px;
    }
  `]
})
export class CompanyDetailsComponent implements OnInit {
  isLoading = false;
  contacts: Contact[] = [];
  projects: Project[] = [];
  activities: Activity[] = [];

  constructor(
    private dialogRef: MatDialogRef<CompanyDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company: Company, docId: string },
    private firestore: Firestore,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadContacts();
    this.loadProjects();
    this.loadActivities();
  }

  private loadContacts(): void {
    const contactsRef = collection(doc(this.firestore, 'companies', this.data.docId), 'contacts');
    onSnapshot(contactsRef, (snapshot) => {
      this.contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Contact));
    });
  }

  private loadProjects(): void {
    const projectsRef = collection(doc(this.firestore, 'companies', this.data.docId), 'projects');
    onSnapshot(projectsRef, (snapshot) => {
      this.projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startDatum: doc.data()['startDatum']?.toDate(),
        endDatum: doc.data()['endDatum']?.toDate()
      } as Project));
    });
  }

  private loadActivities(): void {
    const activitiesRef = collection(doc(this.firestore, 'companies', this.data.docId), 'activities');
    onSnapshot(activitiesRef, (snapshot) => {
      this.activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        datum: doc.data()['datum']?.toDate()
      } as Activity));
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'aktiv': return 'primary';
      case 'geplant': return 'accent';
      case 'abgeschlossen': return 'primary';
      case 'pausiert': return 'warn';
      default: return '';
    }
  }

  getActivityIcon(typ: string): string {
    switch (typ) {
      case 'anruf': return 'phone';
      case 'meeting': return 'group';
      case 'email': return 'email';
      case 'notiz': return 'note';
      default: return 'event';
    }
  }

  // Dialog-Öffnungsmethoden
  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: { companyId: this.data.docId }
    });

    dialogRef.afterClosed().subscribe(async (result: Contact) => {
      if (result) {
        try {
          const contactData: Partial<Contact> = {
            name: result.name,
            position: result.position,
            email: result.email,
            phone: result.phone,
            notes: result.notes,
            createdAt: serverTimestamp()
          };
          
          const contactsRef = collection(doc(this.firestore, 'companies', this.data.docId), 'contacts');
          await addDoc(contactsRef, contactData);
          
          // Aktualisiere die Statistik
          const companyRef = doc(this.firestore, 'companies', this.data.docId);
          await updateDoc(companyRef, {
            'stats.kontakte': this.contacts.length + 1
          });
        } catch (error) {
          console.error('Fehler beim Hinzufügen des Kontakts:', error);
          this.snackBar.open('Fehler beim Hinzufügen des Kontakts', 'Schließen', { duration: 3000 });
        }
      }
    });
  }

  openAddProjectDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      data: { companyId: this.data.docId }
    });

    dialogRef.afterClosed().subscribe(projectData => {
      if (projectData) {
        this.isLoading = true;
        const projectRef = collection(this.firestore, `companies/${this.data.docId}/projects`);
        addDoc(projectRef, {
          ...projectData,
          createdAt: serverTimestamp()
        }).then(() => {
          this.isLoading = false;
          this.snackBar.open('Projekt erfolgreich hinzugefügt', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Hinzufügen des Projekts:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Hinzufügen des Projekts', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  openAddActivityDialog(): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: { companyId: this.data.docId }
    });

    dialogRef.afterClosed().subscribe(activityData => {
      if (activityData) {
        this.isLoading = true;
        const activityRef = collection(this.firestore, `companies/${this.data.docId}/activities`);
        addDoc(activityRef, {
          ...activityData,
          createdAt: serverTimestamp()
        }).then(() => {
          this.isLoading = false;
          this.snackBar.open('Aktivität erfolgreich hinzugefügt', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Hinzufügen der Aktivität:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Hinzufügen der Aktivität', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  // CRUD-Operationen
  async deleteContact(contact: Contact): Promise<void> {
    if (contact.id) {
      try {
        const contactRef = doc(this.firestore, `companies/${this.data.docId}/contacts/${contact.id}`);
        await deleteDoc(contactRef);
        
        // Aktualisiere die Statistik
        const companyRef = doc(this.firestore, 'companies', this.data.docId);
        await updateDoc(companyRef, {
          'stats.kontakte': this.contacts.length - 1
        });
      } catch (error) {
        console.error('Fehler beim Löschen des Kontakts:', error);
      }
    }
  }

  async deleteProject(project: Project): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Projekt löschen',
        message: `Möchten Sie das Projekt "${project.name}" wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const projectRef = doc(this.firestore, `companies/${this.data.docId}/projects/${project.id}`);
        deleteDoc(projectRef).then(() => {
          this.isLoading = false;
          this.snackBar.open('Projekt erfolgreich gelöscht', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Löschen des Projekts:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Löschen des Projekts', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  async deleteActivity(activity: Activity): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Aktivität löschen',
        message: `Möchten Sie die Aktivität vom ${activity.datum} wirklich löschen?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const activityRef = doc(this.firestore, `companies/${this.data.docId}/activities/${activity.id}`);
        deleteDoc(activityRef).then(() => {
          this.isLoading = false;
          this.snackBar.open('Aktivität erfolgreich gelöscht', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Löschen der Aktivität:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Löschen der Aktivität', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  editContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      data: {
        companyId: this.data.docId,
        contact: contact
      }
    });

    dialogRef.afterClosed().subscribe(async (result: Contact) => {
      if (result) {
        try {
          const contactData = {
            name: result.name,
            position: result.position,
            email: result.email,
            phone: result.phone,
            notes: result.notes || ''
          };
          
          const contactRef = doc(this.firestore, `companies/${this.data.docId}/contacts/${contact.id}`);
          await updateDoc(contactRef, contactData);
        } catch (error) {
          console.error('Fehler beim Aktualisieren des Kontakts:', error);
        }
      }
    });
  }

  editProject(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      data: { companyId: this.data.docId, project }
    });

    dialogRef.afterClosed().subscribe(projectData => {
      if (projectData) {
        this.isLoading = true;
        const projectRef = doc(this.firestore, `companies/${this.data.docId}/projects/${project.id}`);
        updateDoc(projectRef, {
          ...projectData,
          updatedAt: serverTimestamp()
        }).then(() => {
          this.isLoading = false;
          this.snackBar.open('Projekt erfolgreich aktualisiert', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Aktualisieren des Projekts:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Aktualisieren des Projekts', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  editActivity(activity: Activity): void {
    const dialogRef = this.dialog.open(ActivityDialogComponent, {
      data: { companyId: this.data.docId, activity }
    });

    dialogRef.afterClosed().subscribe(activityData => {
      if (activityData) {
        this.isLoading = true;
        const activityRef = doc(this.firestore, `companies/${this.data.docId}/activities/${activity.id}`);
        updateDoc(activityRef, {
          ...activityData,
          updatedAt: serverTimestamp()
        }).then(() => {
          this.isLoading = false;
          this.snackBar.open('Aktivität erfolgreich aktualisiert', 'Schließen', { duration: 3000 });
        }).catch(error => {
          console.error('Fehler beim Aktualisieren der Aktivität:', error);
          this.isLoading = false;
          this.snackBar.open('Fehler beim Aktualisieren der Aktivität', 'Schließen', { duration: 3000 });
        });
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', company: this.data.company });
  }
} 