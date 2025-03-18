import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from './../shared.module';

interface Company {
  id: number;
  name: string;
  branche: string;
  standort: string;
  telefon: string;
  email: string;
  stats: {
    kontakte: number;
    projekte: number;
    aktivitaeten: number;
  }
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
    SharedModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  companies: Company[] = [
    {
      id: 1,
      name: 'TechSolutions GmbH',
      branche: 'Software & IT',
      standort: 'Berlin',
      telefon: '+49 30 123456-1',
      email: 'kontakt@techsolutions.de',
      stats: {
        kontakte: 15,
        projekte: 8,
        aktivitaeten: 12
      }
    },
    {
      id: 2,
      name: 'EcoEnergy AG',
      branche: 'Erneuerbare Energien',
      standort: 'Hamburg',
      telefon: '+49 40 987654-2',
      email: 'info@ecoenergy.de',
      stats: {
        kontakte: 24,
        projekte: 6,
        aktivitaeten: 18
      }
    },
    {
      id: 3,
      name: 'MedCare Systems',
      branche: 'Gesundheitswesen',
      standort: 'München',
      telefon: '+49 89 456789-3',
      email: 'kontakt@medcare.de',
      stats: {
        kontakte: 32,
        projekte: 12,
        aktivitaeten: 25
      }
    },
    {
      id: 4,
      name: 'LogistikPlus GmbH',
      branche: 'Logistik & Transport',
      standort: 'Frankfurt',
      telefon: '+49 69 234567-4',
      email: 'info@logistikplus.de',
      stats: {
        kontakte: 18,
        projekte: 4,
        aktivitaeten: 15
      }
    }
  ];

  getEmail(index: number): string {
    return `kontakt@musterfirma${index}.de`;
  }
}
