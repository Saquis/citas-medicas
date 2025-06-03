import { Routes } from '@angular/router';
import { InicioSesionComponent } from './modulos/inicio-sesion/inicio-sesion.component';
import { AdministradorComponent } from './modulos/administrador/administrador.component';
import { MedicoComponent } from './modulos/medico/medico.component';
import { PacienteComponent } from './modulos/paciente/paciente.component';
import { SecretariaComponent } from './modulos/secretaria/secretaria.component';
import { AuthGuard } from './nucleo/guardias/auth.guard';

export const routes: Routes = [
  { path: '', component: InicioSesionComponent },
  { 
    path: 'administrador', 
    component: AdministradorComponent,
    canActivate: [AuthGuard],
    data: { rol: 'administrador' }
  },
  { 
    path: 'medico', 
    component: MedicoComponent,
    canActivate: [AuthGuard],
    data: { rol: 'medico' }
  },
  { 
    path: 'paciente', 
    component: PacienteComponent,
    canActivate: [AuthGuard],
    data: { rol: 'paciente' }
  },
  { 
    path: 'secretaria', 
    component: SecretariaComponent,
    canActivate: [AuthGuard],
    data: { rol: 'secretaria' }
  },
  { path: '**', redirectTo: '' } // Redirige todas las rutas. 
];
