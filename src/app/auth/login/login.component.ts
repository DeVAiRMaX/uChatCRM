import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };
  isLoading = false;
  showSuccess = false;
  loginError = '';

  constructor(
    private firestore: Firestore, 
    private router: Router,
    private authService: AuthService
  ) {}

  async onSubmit() {
    this.startLoading();
    
    try {
      const userData = await this.checkUserExists();
      await this.verifyPassword(userData);
      this.handleSuccess();
    } catch (err) {
      this.handleError(err);
    }
  }

  private startLoading(): void {
    this.isLoading = true;
    this.loginError = '';
  }

  private async checkUserExists(): Promise<any> {
    const accountsRef = collection(this.firestore, 'accounts');
    const emailQuery = query(accountsRef, where('email', '==', this.loginData.email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      throw new Error('USER_NOT_FOUND');
    }

    return querySnapshot.docs[0].data();
  }

  private async verifyPassword(userData: any): Promise<void> {
    if (userData['password'] !== this.loginData.password) {
      throw new Error('INVALID_PASSWORD');
    }
  }

  private handleSuccess(): void {
    this.isLoading = false;
    this.showSuccess = true;
    // Generiere ein einfaches Token (in der Praxis sollte dies vom Backend kommen)
    const token = btoa(this.loginData.email + ':' + Date.now());
    this.authService.login(token);
    this.navigateToDashboard();
  }

  private navigateToDashboard(): void {
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 2000);
  }

  private handleError(err: any): void {
    console.error('Login-Fehler:', err);
    this.isLoading = false;
    
    switch(err.message) {
      case 'USER_NOT_FOUND':
        this.loginError = 'Benutzer nicht gefunden';
        break;
      case 'INVALID_PASSWORD':
        this.loginError = 'Falsches Passwort';
        break;
      default:
        this.loginError = 'Ein Fehler ist aufgetreten';
    }
  }
}
