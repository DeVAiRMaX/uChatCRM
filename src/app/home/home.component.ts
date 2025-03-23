import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared.module';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  totalUsers: number = 0;
  totalCompanies: number = 0;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    this.loadTotalUsers();
    this.loadTotalCompanies();
  }

  private async loadTotalUsers() {
    const usersCollection = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersCollection);
    this.totalUsers = snapshot.size;
  }

  private async loadTotalCompanies() {
    const companiesCollection = collection(this.firestore, 'companies');
    const snapshot = await getDocs(companiesCollection);
    this.totalCompanies = snapshot.size;
  }
}
