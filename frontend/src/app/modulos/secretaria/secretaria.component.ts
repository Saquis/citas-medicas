import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-secretaria',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.css']
})
export class SecretariaComponent implements OnInit {
  seccion: string = 'citas';
  citas: any[] = [];

  pacientes: any[] = [];
  medicos: any[] = [];

  citaForm: any = {
    paciente_id: '',
    medico_id: '',
    fecha_hora: '',
    duracion: '',
    estado: 'pendiente',
    tipo_cita: '',
    especialidad: '',
    notas: '',
    sintomas: ''
  };

  citaEditandoId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCitas();
    this.loadPacientes();
    this.loadMedicos();
  }

  loadCitas(): void {
    this.authService.getCitas().subscribe({
      next: (citas) => {
        this.citas = citas;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
      }
    });
  }

  loadPacientes(): void {
    this.authService.getPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes = pacientes;
      },
      error: (error) => {
        console.error('Error al cargar pacientes:', error);
      }
    });
  }

  loadMedicos(): void {
    this.authService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
      },
      error: (error) => {
        console.error('Error al cargar médicos:', error);
      }
    });
  }

  crearCita(): void {
    this.authService.crearCita(this.citaForm).subscribe({
      next: (nuevaCita) => {
        this.citas.push(nuevaCita);
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al crear cita:', error);
      }
    });
  }

  private isoToLocalDatetime(isoString: string): string {
    if (!isoString) return '';
    const date = new Date(isoString);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  editarCita(cita: any): void {
    this.citaEditandoId = cita._id;
    // Para evitar modificar el objeto original, hacemos copia profunda:
    this.citaForm = { ...cita };
    // Convertimos fecha ISO a formato local aceptado por datetime-local:
    this.citaForm.fecha_hora = this.isoToLocalDatetime(cita.fecha_hora);
  }
  

  guardarEdicion(): void {
    if (!this.citaEditandoId) return;

    const citaParaEnviar = { ...this.citaForm };
    citaParaEnviar.fecha_hora = new Date(citaParaEnviar.fecha_hora).toISOString();

    this.authService.editarCita(this.citaEditandoId, citaParaEnviar).subscribe({
      next: (citaActualizada) => {
        const index = this.citas.findIndex(c => c._id === this.citaEditandoId);
        if (index !== -1) this.citas[index] = citaActualizada;
        this.citaEditandoId = null;
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al editar cita:', error);
      }
    });
  }

  cancelarEdicion(): void {
    this.citaEditandoId = null;
    this.limpiarFormulario();
  }

  eliminarCita(id: string): void {
    this.authService.eliminarCita(id).subscribe({
      next: () => {
        this.citas = this.citas.filter(c => c._id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar cita:', error);
      }
    });
  }

  limpiarFormulario(): void {
    this.citaForm = {
      paciente_id: '',
      medico_id: '',
      fecha_hora: '',
      duracion: '',
      estado: 'pendiente',
      tipo_cita: '',
      especialidad: '',
      notas: '',
      sintomas: ''
    };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
