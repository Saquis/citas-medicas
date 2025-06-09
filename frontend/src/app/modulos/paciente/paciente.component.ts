import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paciente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {
  citas: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.authService.getCitasPorPaciente().subscribe({
      next: (citas) => {
        this.citas = citas;
      },
      error: (error) => {
        console.error('Error al cargar citas del paciente:', error);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}