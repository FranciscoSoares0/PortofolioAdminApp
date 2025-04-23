import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private readonly authService = inject(AuthService);

  logout(){
    this.authService.logout();
  }

}
