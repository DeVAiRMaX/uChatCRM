/**
 * @module AppComponent
 * @description Haupt-Komponente der uChatCRM-Anwendung.
 * Diese Komponente dient als Root-Komponente und verwaltet die grundlegende
 * Anwendungsstruktur sowie die Navigation.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SharedModule } from './shared.module';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  /** Titel der Anwendung */
  title = 'test';

  /**
   * Konstruktor der AppComponent
   * @param authService - Service für die Authentifizierung
   * @param router - Angular Router für die Navigation
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Behandelt den Logout-Vorgang
   * Meldet den Benutzer ab und navigiert zur Login-Seite
   */
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
