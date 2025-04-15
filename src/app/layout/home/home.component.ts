import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectsDisplayComponent } from '../../projects/projects-display/projects-display.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
