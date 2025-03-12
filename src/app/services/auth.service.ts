import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn);
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isAuthenticatedSubject.next(true);
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
} 