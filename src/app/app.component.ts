/**
 * @module AppComponent
 * @description Haupt-Komponente der uChatCRM-Anwendung.
 * Diese Komponente dient als Root-Komponente und verwaltet die grundlegende
 * Anwendungsstruktur sowie die Navigation.
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SharedModule } from './shared.module';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  /** Titel der Anwendung */
  title = 'test';
  isLoggedIn = false;
  showDrawer = false;
  private authSubscription: Subscription | undefined;
  private loginSubscription: Subscription | undefined;

  /**
   * Konstruktor der AppComponent
   * @param authService - Service für die Authentifizierung
   * @param router - Angular Router für die Navigation
   */
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initial check
    this.checkIfLoggedIn();
    
    // Subscribe to auth status changes with delay for drawer (nur beim Login)
    this.authSubscription = this.authService.isLoggedIn$.pipe(
      tap(loggedIn => {
        // Beim Ausloggen sofort ausblenden
        if (!loggedIn) {
          this.showDrawer = false;
        }
      }),
      delay(2000) // 2 Sekunden Verzögerung nur für Login
    ).subscribe(
      (loggedIn: boolean) => {
        // Nur beim Login verzögert einblenden
        if (loggedIn) {
          this.showDrawer = true;
        }
      }
    );

    // Sofortiges Update des Login-Status
    this.loginSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.isLoggedIn = loggedIn;
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  checkIfLoggedIn() {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedIn = isLoggedIn && !!token;
    this.showDrawer = this.isLoggedIn;
  }

  /**
   * Behandelt den Logout-Vorgang
   * Meldet den Benutzer ab und navigiert zur Login-Seite
   */
  onLogout() {
    this.showDrawer = false; // Sofort ausblenden
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
