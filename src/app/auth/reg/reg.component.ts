import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormsModule, NgForm } from '@angular/forms';
import { Register } from '../../../assets/module/register.class';
import { Firestore, addDoc, collection, doc, setDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.scss'
})
export class RegComponent {
  registerData = new Register();
  isLoading = false;
  showSuccess = false;
  registrationError = '';
  @ViewChild('regForm') regForm!: NgForm;

  constructor(private firestore: Firestore, private router: Router) {}

  async onSubmit() {
    this.startLoading();
    
    try {
      await this.checkEmailExists();
      await this.saveUserData();
      this.handleSuccess();
    } catch (err) {
      this.handleError(err);
    }
  }

  private startLoading(): void {
    this.isLoading = true;
    this.registrationError = '';
  }

  private async checkEmailExists(): Promise<void> {
    const accountsRef = collection(this.firestore, 'accounts');
    const emailQuery = query(accountsRef, where('email', '==', this.registerData.email));
    const querySnapshot = await getDocs(emailQuery);

    if (!querySnapshot.empty) {
      throw new Error('EMAIL_EXISTS');
    }
  }

  private async saveUserData(): Promise<void> {
    await addDoc(collection(this.firestore, 'accounts'), this.registerData.toJson());
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.showSuccess = true;
    this.navigateToLogin();
  }

  private navigateToLogin(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  private handleError(err: any): void {
    console.error('Fehler bei der Registrierung:', err);
    this.isLoading = false;
    
    if (err.message === 'EMAIL_EXISTS') {
      this.registrationError = 'Diese E-Mail-Adresse ist bereits registriert';
    } else {
      this.registrationError = 'Ein Fehler ist bei der Registrierung aufgetreten';
    }
  }

  resetForm() {
    this.registerData = new Register();
    this.regForm.resetForm();
  }
}

