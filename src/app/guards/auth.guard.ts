/**
 * @module AuthGuard
 * @description Route Guard für die Authentifizierung in der uChatCRM-Anwendung.
 * Schützt Routen vor unauthentifiziertem Zugriff.
 */
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @function authGuard
 * @description Prüft, ob ein Benutzer authentifiziert ist und Zugriff auf eine Route hat
 * @param route - Die zu aktivierende Route
 * @param state - Der aktuelle Router-Status
 * @returns {boolean | UrlTree} true wenn authentifiziert, sonst Weiterleitung zur Login-Seite
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
}; 