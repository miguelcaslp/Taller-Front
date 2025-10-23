import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { TallerAdmin } from './pages/taller-admin/taller-admin';
import { authGuard } from './auth/auth-guard';
import { EmpladosAdmin } from './pages/emplados-admin/emplados-admin';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'taller-admin', component: TallerAdmin,  canActivate: [authGuard] },
    { path: 'empleados-admin', component: EmpladosAdmin,  canActivate: [authGuard] },

];

