import { Component, inject, input } from '@angular/core';
import { Experience } from '../interfaces/experience';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ExperiencesService } from '../services/experiences.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-experience-card',
  imports: [RouterLink,MatIconModule,MatIconButton],
  templateUrl: './experience-card.component.html',
  styleUrl: './experience-card.component.css'
})
export class ExperienceCardComponent {

  private readonly experiencesService = inject(ExperiencesService);
  private readonly snackBar = inject(MatSnackBar);

  experience = input<Experience>();

  DeleteExperience(experienceId:string){
    this.experiencesService.deleteExperience(experienceId).subscribe({
      next: () => {
        this.snackBar.open('Experience successfully deleted', 'Close', { duration: 1000 });
      },
      error: (err) => {
        this.snackBar.open('Error deleting experience', 'Close', { duration: 1000 });
      },
    })
  }
}
