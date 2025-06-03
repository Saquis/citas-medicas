import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL del backend local (Node.js/Express)
  private apiUrl = 'http://localhost:3000/api/auth'; // Ajusta el puerto si es diferente

  constructor(private http: HttpClient, private router: Router) {}

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, contrasena }).pipe(
      tap((response: any) => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('rol', response.datosUsuario.rol); // ✔️ Correcto
})
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}