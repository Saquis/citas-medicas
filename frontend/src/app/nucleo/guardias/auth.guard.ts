import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard ejecutándose...'); // Debug

    // 1. Verificar si estamos en el navegador antes de acceder a localStorage
    if (!isPlatformBrowser(this.platformId)) {
      return false; // En servidor, no permitir acceso
    }

    // 2. Verificar si hay token (usuario autenticado)
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', !!token); // Debug

    if (!token) {
      console.log('No hay token, redirigiendo al login');
      this.router.navigate(['']); // Redirige a la página de login (ruta vacía)
      return false;
    }

    // 3. Verificar rol requerido (si la ruta lo especifica)
    const rolRequerido = next.data['rol'];
    console.log('Rol requerido:', rolRequerido); // Debug

    if (rolRequerido) {
      // Obtener rol desde el objeto user
      const userData = localStorage.getItem('user');

      if (!userData) {
        console.log('No hay datos de usuario');
        this.router.navigate(['']);
        return false;
      }

      try {
        const user = JSON.parse(userData);
        const rolUsuario = user.rol;

        console.log('Rol del usuario:', rolUsuario); // Debug
        console.log('¿Roles coinciden?', rolUsuario === rolRequerido); // Debug

        if (rolUsuario !== rolRequerido) {
          console.log('Rol no autorizado');
          this.router.navigate(['']); // Redirige al login si no tiene el rol correcto
          return false;
        }
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.router.navigate(['']);
        return false;
      }
    }

    console.log('AuthGuard: Acceso permitido');
    return true;
  }
}