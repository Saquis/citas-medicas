import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, contrasena });
  }
}
