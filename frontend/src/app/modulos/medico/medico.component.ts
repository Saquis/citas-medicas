import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service'; // Asegúrate de que esta ruta sea correcta
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  citas: any[] = [];
  nuevoRegistro = { citaId: '', notas: '', estado: 'completada' };
  medicoId: string | null = null;
  seccion: string = 'citas';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.medicoId = this.authService.getUserId();
    console.log('medicoId:', this.medicoId); // Depuración
    if (!this.medicoId) {
      console.error('No se encontró el ID del médico. Redirigiendo al login.');
      this.router.navigate(['/login']);
      return;
    }
    this.loadCitas();
  }

  loadCitas(): void {
    this.authService.getCitas().subscribe({
      next: (citas) => {
        this.citas = citas.filter(cita => 
          cita.medico_id && cita.medico_id.toString() === this.medicoId
        );
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
      }
    });
  }

  registrarAtencion(): void {
    console.log('Registro de atención:', this.nuevoRegistro);
    this.nuevoRegistro = { citaId: '', notas: '', estado: 'completada' };
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}