import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../../nucleo/servicios/autenticacion.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-secretaria',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.css']
})
export class SecretariaComponent implements OnInit {
  seccion: string = 'citas';
  citas: any[] = [];

  constructor(
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.autenticacionService.getCitas().subscribe({
      next: (citas) => {
        this.citas = citas;
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
      }
    });
  }

  logout(): void {
    this.autenticacionService.logout();
    this.router.navigate(['/']);
  }
}