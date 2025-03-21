/**
 * @module AppRoutes
 * @description Routing-Konfiguration der uChatCRM-Anwendung.
 * Definiert alle verfügbaren Routen und deren Zugriffsberechtigungen.
 */
import { Routes, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UserComponent } from './user/user.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegComponent } from './auth/reg/reg.component';
import { authGuard } from './guards/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { ReportsComponent } from './reports/reports.component';
import { CompanyComponent } from './company/company.component';
import { AuthService } from './services/auth.service';

/**
 * @type {Routes}
 * @description Definiert die Routing-Konfiguration der Anwendung
 * 
 * Enthält folgende Routen:
 * - / : Login-Seite (Standard-Route)
 * - /dashboard : Dashboard (geschützt)
 * - /user : Benutzerverwaltung (geschützt)
 * - /userinformation/:id : Detailansicht eines Benutzers (geschützt)
 * - /login : Login-Seite
 * - /register : Registrierungsseite
 * - /company : Unternehmensverwaltung (geschützt)
 * - /reports : Berichtsseite (geschützt)
 * - /settings : Einstellungen (geschützt)
 */
export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const auth = inject(AuthService);
            if (auth.isAuthenticated()) {
                inject(Router).navigate(['/dashboard']);
                return false;
            }
            return true;
        }]
    },
    {
        path: 'dashboard',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    {
        path: 'user',
        component: UserComponent,
        canActivate: [authGuard]
    },
    {
        path: 'userinformation/:id',
        component: UserInformationComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const auth = inject(AuthService);
            if (auth.isAuthenticated()) {
                inject(Router).navigate(['/dashboard']);
                return false;
            }
            return true;
        }]
    },
    {
        path: 'register',
        component: RegComponent,
        canActivate: [(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
            const auth = inject(AuthService);
            if (auth.isAuthenticated()) {
                inject(Router).navigate(['/dashboard']);
                return false;
            }
            return true;
        }]
    },
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [authGuard]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard]
    }
];

