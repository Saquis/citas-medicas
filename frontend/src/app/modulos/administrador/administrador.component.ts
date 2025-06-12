import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../nucleo/autenticacion/auth.service'; // Ajuste de servicio
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component'; // Para peticiones HTTP
import { FormsModule } from '@angular/forms'; // Importado para ngModel

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule, FooterComponent, FormsModule], // Añadido FormsModule
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  seccion: string = 'usuarios'; // Sección activa
  usuarios: any[] = []; // Lista de usuarios
  usuarioSeleccionado: any = null; // Usuario para edición o eliminación
  nuevoUsuario: any = { nombre: '', usuario: '', correo: '', password: '', rol: 'paciente' }; // Datos para crear

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuarios(); // Cargar usuarios al iniciar
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Cargar usuarios desde el backend
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

  // Crear un nuevo usuario
  crearUsuario(): void {
    this.authService.createUsuario(this.nuevoUsuario).subscribe({
      next: (response) => {
        console.log('Usuario creado:', response);
        this.cargarUsuarios(); // Recargar la lista
        this.nuevoUsuario = { nombre: '', usuario: '', correo: '', password: '', rol: 'paciente' }; // Resetear formulario
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
      }
    });
  }

  // Seleccionar usuario para edición o eliminación
  seleccionarUsuario(usuario: any): void {
    this.usuarioSeleccionado = { ...usuario }; // Clonar para no modificar el original
  }

  // Actualizar usuario
  actualizarUsuario(): void {
    if (this.usuarioSeleccionado && this.usuarioSeleccionado._id) {
      this.authService.updateUsuario(this.usuarioSeleccionado._id, this.usuarioSeleccionado).subscribe({
        next: (response) => {
          console.log('Usuario actualizado:', response);
          this.cargarUsuarios(); // Recargar la lista
          this.usuarioSeleccionado = null; // Limpiar selección
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      });
    }
  }

  // Eliminar usuario
  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.authService.deleteUsuario(id).subscribe({
        next: (response) => {
          console.log('Usuario eliminado:', response);
          this.cargarUsuarios(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }

  // Cambiar sección (opcional, para futura expansión)
  cambiarSeccion(seccion: string): void {
    this.seccion = seccion;
  }
}