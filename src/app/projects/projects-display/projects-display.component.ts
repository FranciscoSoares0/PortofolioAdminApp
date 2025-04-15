import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../services/projects.service';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-display',
  imports: [CommonModule,ProjectCardComponent,RouterLink],
  templateUrl: './projects-display.component.html',
  styleUrl: './projects-display.component.css'
})
export class ProjectsDisplayComponent implements OnInit{

  private readonly projectsService = inject(ProjectsService);

  myProjects$ = this.projectsService.myProjects$;

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe();
  }

}
