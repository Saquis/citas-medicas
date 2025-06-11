import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-medico',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, FooterComponent],
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
    console.log('medicoId:', this.medicoId); // ✅ Log para verificar el ID

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
        console.log('Citas completas recibidas del backend:', citas); // ✅ Log 1

        if (!this.medicoId) {
          console.warn('medicoId no definido al filtrar citas'); // ✅ Log 2
          return;
        }

        this.citas = citas.filter(cita => {
          console.log('Evaluando cita:', cita); // ✅ Log 3

          // Si medico_id es un objeto (por ejemplo, { _id: '123' }), ajustar aquí
          const medicoCitaId = typeof cita.medico_id === 'object' ? cita.medico_id._id : cita.medico_id;

          const coincide = medicoCitaId?.toString() === this.medicoId;
          console.log(`¿Cita coincide con médico ${this.medicoId}?`, coincide); // ✅ Log 4

          return coincide;
        });

        console.log('Citas filtradas para el médico:', this.citas); // ✅ Log 5
      },
      error: (error) => {
        console.error('Error al cargar citas:', error); // ✅ Log 6
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
