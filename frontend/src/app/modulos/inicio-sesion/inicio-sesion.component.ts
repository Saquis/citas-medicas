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
        console.log('Respuesta del backend:', respuesta);

        // Aquí puedes guardar el token en localStorage si deseas
        localStorage.setItem('token', respuesta.token);

        // Redireccionar según el rol
        switch (respuesta.rol) {
          case 'administrador':
            this.router.navigate(['/administrador']);
            break;
          case 'medico':
            this.router.navigate(['/medico']);
            break;
          case 'paciente':
            this.router.navigate(['/paciente']);
            break;
          case 'secretaria':
            this.router.navigate(['/secretaria']);
            break;
          default:
            console.warn('Rol no reconocido');
            break;
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        alert('Credenciales inválidas o error de servidor.');
      }
    });
  }
}
}
