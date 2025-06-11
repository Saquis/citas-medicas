import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Endpoint de autenticación
  private apiCitasUrl = 'http://localhost:3000/api/citas'; // Endpoint de citas

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(usuario: string, contrasena: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { usuario, contrasena }).pipe(
    tap((response: any) => {
      console.log('Entrando en login'); // Nuevo log para verificar ejecución
      console.log('Respuesta del login:', response); // Depuración
      console.log('Datos del usuario en login:', response.datosUsuario); // Log para depurar
      if (response.token && response.datosUsuario && isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('rol', response.datosUsuario.rol);
        localStorage.setItem('userId', response.datosUsuario.id);
        console.log('Guardado en localStorage:', {
          token: response.token,
          rol: response.datosUsuario.rol,
          userId: response.datosUsuario.id
        });
      } else {
        console.warn('Respuesta incompleta o no en navegador:', response);
      }
    })
  );
}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null; // Retorna null en el servidor
  }

  getRol(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rol');
    }
    return null; // Retorna null en el servidor
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId'); // Corrección: usa userId directamente
    }
    return null; // Retorna null en el servidor
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']); // Ajuste a /login si es tu ruta de inicio
  }

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiCitasUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  getCitasPorPaciente(): Observable<any[]> {
    const userId = this.getUserId();
    console.log('Token enviado:', this.getToken()); // Log para depuración
    console.log('User ID:', userId); // Log para depuración
    return this.http.get<any[]>(`${this.apiUrl}/pacientes/${userId}/citas`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }
}