import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../nucleo/servicios/autenticacion.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AutenticacionService 
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usuario, contrasena } = this.loginForm.value;

      this.authService.login(usuario, contrasena).subscribe({
        next: (respuesta) => {
          console.log('Respuesta completa:', respuesta);

          // 🔥 GUARDAR DATOS DEL USUARIO EN LOCALSTORAGE
          localStorage.setItem('user', JSON.stringify(respuesta.datosUsuario));
          localStorage.setItem('token', respuesta.token);
          
          

          // Redirección según el rol
          const rol = respuesta.datosUsuario?.rol?.toLowerCase();
          console.log('Rol Normalizado:', rol);
          
          switch (rol) {
            case 'administrador':
              console.log('Navegando al administrador');
              this.router.navigate(['/administrador']).then(
                success => console.log('✅ Navegación exitosa:', success),
                error => console.log('❌ Error en navegación:', error)
              );
              break;
            case 'medico':
              console.log('Navegando al médico');
              this.router.navigate(['/medico']).then(
                success => console.log('✅ Navegación exitosa:', success),
                error => console.log('❌ Error en navegación:', error)
              );
              break;
            case 'paciente':
              console.log('Navegando al paciente');
              this.router.navigate(['/paciente']).then(
                success => console.log('✅ Navegación exitosa:', success),
                error => console.log('❌ Error en navegación:', error)
              );
              break;
            case 'secretaria':
              console.log('Navegando a secretaria');
              this.router.navigate(['/secretaria']).then(
                success => console.log(' Navegación exitosa:', success),
                error => console.log(' Error en navegación:', error)
              );
              break;
            default:
              console.warn('Rol no reconocido:', rol);
              alert('Rol de usuario no válido');
              break;
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Credenciales inválidas o error de servidor.');
        }
      });
    } else {
      console.log('Formulario no válido');
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
    }
  }

  // Método auxiliar para mostrar errores de validación
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field} es requerido`;
    }
    return '';
  }
}