/**
 * @module AuthService
 * @description Service zur Verwaltung der Authentifizierung in der uChatCRM-Anwendung.
 * Verwaltet den Authentifizierungsstatus und Token-Handling.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** BehaviorSubject für den Authentifizierungsstatus */
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  /** Observable für den Authentifizierungsstatus */
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * Konstruktor des AuthService
   * Prüft den initialen Authentifizierungsstatus
   */
  constructor() {
    this.checkInitialLoginState();
  }

  /**
   * Prüft den aktuellen Authentifizierungsstatus
   * @private
   */
  private checkInitialLoginState(): void {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn && !!token);
  }

  /**
   * Führt den Login-Prozess durch
   * @param token - Der Authentifizierungs-Token
   */
  login(token: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
  }

  /**
   * Führt den Logout-Prozess durch
   * Entfernt Token und setzt den Login-Status zurück
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    this.isLoggedInSubject.next(false);
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