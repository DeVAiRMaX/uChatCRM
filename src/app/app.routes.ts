import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserInformationComponent } from './user/user-information/user-information.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegComponent } from './auth/reg/reg.component';
import { authGuard } from './guards/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { ReportsComponent } from './reports/reports.component';
import { CompanyComponent } from './company/company.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
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
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegComponent
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

