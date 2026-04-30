import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Theme, ThemeService } from '@core/services/theme.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {


  constructor(

    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) {
  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
