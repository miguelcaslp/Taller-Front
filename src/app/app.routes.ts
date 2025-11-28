import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { TallerAdmin } from './adminPages/taller-admin/taller-admin';
import { RoleGuard } from './auth/role-guard';
import { EmpladosAdmin } from './adminPages/emplados-admin/emplados-admin';
import { Reparaciones } from './recepcionPages/reparaciones/reparaciones';
import { Clientes } from './recepcionPages/clientes/clientes';
import { Vehiculos } from './recepcionPages/vehiculos/vehiculos';
import { Tareas } from './recepcionPages/tareas/tareas';
import { TareasMecanico } from './MecanicoPages/tareas-mecanico/tareas-mecanico';
import { NoAutorizado } from './pages/no-autorizado/no-autorizado';
import { Factura } from './recepcionPages/factura/factura';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'taller-admin', component: TallerAdmin,  canActivate: [RoleGuard], data: { roles: ['Admin'] }  },
    { path: 'empleados-admin', component: EmpladosAdmin,  canActivate: [RoleGuard], data: { roles: ['Admin'] }   },
    { path: 'reparaciones', component: Reparaciones,  canActivate: [RoleGuard], data: { roles: ['Recepcionista'] }   },
    { path: 'clientes', component: Clientes,  canActivate: [RoleGuard], data: { roles: ['Recepcionista'] } },
    { path: 'vehiculos', component: Vehiculos,  canActivate: [RoleGuard], data: { roles: ['Recepcionista'] } },
    { path: 'tareas', component: Tareas,  canActivate: [RoleGuard], data: { roles: ['Recepcionista'] } },
    { path: 'tareas-mecanico', component: TareasMecanico,  canActivate: [RoleGuard], data: { roles: ['Mecanico'] }},
    { path: 'factura/:id', component: Factura,  canActivate: [RoleGuard], data: { roles: ['Recepcionista'] }},
    { path: 'no-autorizado', component: NoAutorizado },
    { path: '**', redirectTo: '' }

];

