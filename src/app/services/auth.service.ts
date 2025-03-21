/**
 * @module AuthService
 * @description Service zur Verwaltung der Authentifizierung in der uChatCRM-Anwendung.
 * Verwaltet den Authentifizierungsstatus und Token-Handling.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** BehaviorSubject für den Authentifizierungsstatus */
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  /** Observable für den Authentifizierungsstatus */
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Konstruktor des AuthService
   * Prüft den initialen Authentifizierungsstatus
   */
  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Prüft den aktuellen Authentifizierungsstatus
   * @private
   */
  private checkAuthStatus() {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isAuthenticatedSubject.next(isLoggedIn && !!token);
  }

  /**
   * Führt den Login-Prozess durch
   * @param token - Der Authentifizierungs-Token
   */
  login(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Führt den Logout-Prozess durch
   * Entfernt Token und setzt den Login-Status zurück
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Prüft, ob der Benutzer authentifiziert ist
   * @returns {boolean} true wenn authentifiziert, sonst false
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return isLoggedIn && !!token;
  }
} 