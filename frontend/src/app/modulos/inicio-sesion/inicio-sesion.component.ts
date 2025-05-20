import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const datos = this.loginForm.value;
      console.log('Datos enviados:', datos);

      // Se puede hacer llamadas al Backend 

      const usuario = datos.usuario.toLowerCase();

      // Simula la navegacion por rol

      switch (usuario) {
        case 'admin':
          this.router.navigate(['/administrador']);
          break;
        case 'medico':
          this.router.navigate(['medico']);
          break;
        case 'paciente':
          this.router.navigate(['/paciente']);
          break;
        case 'secretaria':
          this.router.navigate(['/secretaria']);
          break;
        default:
          console.warn('Rol no conocido'); // o redireccionar a una pagina de error
          break;



      }
    }
  }
}
