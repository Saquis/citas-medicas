import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service'; // Ajuste de servicio
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from "../footer/footer.component"; // Para peticiones HTTP

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule, FooterComponent], // Añadido HttpClientModule
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  seccion: string = 'usuarios'; // Sección activa
  usuarios: any[] = []; // Datos de usuarios

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Cargar usuarios al iniciar
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Método para cargar usuarios desde el backend
  cargarUsuarios(): void {
    this.authService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios; // Asigna los datos reales
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  // Método para cambiar sección (opcional, si planeas más secciones)
  cambiarSeccion(seccion: string): void {
    this.seccion = seccion;
  }
}