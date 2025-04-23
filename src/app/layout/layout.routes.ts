import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectFormComponent } from '../projects/project-form/project-form.component';
import { ProjectsDisplayComponent } from '../projects/projects-display/projects-display.component';
import { unsavedProjectGuard } from './guards/unsaved-project.guard';
import { ExperiencesDisplayComponent } from '../experiences/experiences-display/experiences-display.component';
import { ExperienceFormComponent } from '../experiences/experience-form/experience-form.component';
import { unsavedExperienceGuard } from './guards/unsaved-experience.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ProjectsDisplayComponent,
      },
      {
        path: 'project/new',
        component: ProjectFormComponent,
        canDeactivate: [unsavedProjectGuard]
      },
      {
        path: 'project/edit/:id',
        component: ProjectFormComponent,
        canDeactivate: [unsavedProjectGuard]
      },
      {
        path: 'experiences',
        component: ExperiencesDisplayComponent,
      },
      {
        path: 'experience/new',
        component: ExperienceFormComponent,
        canDeactivate: [unsavedExperienceGuard]
      },
      {
        path: 'experience/edit/:id',
        component: ExperienceFormComponent,
        canDeactivate: [unsavedExperienceGuard]
      },
    ],
  },
];
