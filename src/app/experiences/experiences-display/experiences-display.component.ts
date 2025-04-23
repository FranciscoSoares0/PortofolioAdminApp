import { Component, inject } from '@angular/core';
import { ExperiencesService } from '../services/experiences.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExperienceCardComponent } from '../experience-card/experience-card.component';

@Component({
  selector: 'app-experiences-display',
  imports: [CommonModule,RouterLink,ExperienceCardComponent],
  templateUrl: './experiences-display.component.html',
  styleUrl: './experiences-display.component.css'
})
export class ExperiencesDisplayComponent {

  private readonly experiencesService = inject(ExperiencesService);

  myExperiences$ = this.experiencesService.myExperiences$;

  ngOnInit(): void {
    this.experiencesService.getExperiences().subscribe();
  }

}
