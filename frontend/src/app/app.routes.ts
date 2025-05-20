import { Routes } from '@angular/router';
import { InicioSesionComponent } from './modulos/inicio-sesion/inicio-sesion.component';
import { AdministradorComponent } from './modulos/administrador/administrador.component';
import { MedicoComponent } from './modulos/medico/medico.component';
import { PacienteComponent } from './modulos/paciente/paciente.component';
import { SecretariaComponent } from './modulos/secretaria/secretaria.component';


export const routes: Routes = [
  { path: '', component: InicioSesionComponent },
  { path: 'administrador', component: AdministradorComponent },
  { path: 'medico', component: MedicoComponent },
  { path: 'paciente', component: PacienteComponent },
  { path: 'secretaria', component: SecretariaComponent }
];
