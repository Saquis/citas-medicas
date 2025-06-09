import { Component, Inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './nucleo/autenticacion/auth.service';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend'; // 👈 Necesario para pasar las pruebas

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.authService.getToken();
    }
    return false;
  }

  getRol(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.authService.getRol();
    }
    return null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
