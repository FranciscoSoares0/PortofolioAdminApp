import { Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Project } from '../interfaces/project';
import { ProjectsService } from '../services/projects.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-project-card',
  imports: [MatIconModule,MatButtonModule,RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {

  private readonly projectsService = inject(ProjectsService);
  private readonly snackBar = inject(MatSnackBar);

  project = input<Project>();

  DeleteProject(projectId:string){
    this.projectsService.deleteProject(projectId).subscribe({
      next: () => {
        this.snackBar.open('Project successfully deleted', 'Close', { duration: 1000 });
      },
      error: (err) => {
        this.snackBar.open('Error deleting project', 'Close', { duration: 1000 });
      },
    })
  }
}
