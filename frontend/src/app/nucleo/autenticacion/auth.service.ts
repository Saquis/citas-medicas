import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Endpoint general de API
  private apiCitasUrl = 'http://localhost:3000/api/citas'; // Endpoint específico para citas

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, contrasena }).pipe(
      tap((response: any) => {
        console.log('Entrando en login');
        console.log('Respuesta del login:', response);
        console.log('Datos del usuario en login:', response.datosUsuario);
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
    return null;
  }

  getRol(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('rol');
    }
    return null;
  }

  getUserId(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('rol');
      localStorage.removeItem('userId');
    }
    this.router.navigate(['/login']);
  }

  // --- Citas ---

  getCitas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiCitasUrl, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  getCitasPorPaciente(): Observable<any[]> {
    console.log('Token enviado:', this.getToken());
    console.log('User ID:', this.getUserId());
    return this.http.get<any[]>(`${this.apiUrl}/pacientes/mis-citas`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  crearCita(cita: any): Observable<any> {
    return this.http.post(this.apiCitasUrl, cita, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  editarCita(id: string, cita: any): Observable<any> {
    return this.http.put(`${this.apiCitasUrl}/${id}`, cita, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  eliminarCita(id: string): Observable<any> {
    return this.http.delete(`${this.apiCitasUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  // --- Usuarios ---

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, usuario, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  updateUsuario(id: string, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  // --- Nuevos métodos para pacientes y médicos ---

  getPacientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pacientes`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }

  getMedicos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/medicos`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${this.getToken() || ''}` })
    });
  }
}
