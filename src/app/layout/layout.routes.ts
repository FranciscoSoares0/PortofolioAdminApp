import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectFormComponent } from '../projects/project-form/project-form.component';
import { ProjectsDisplayComponent } from '../projects/projects-display/projects-display.component';
import { unsavedProjectGuard } from './guards/unsaved-project.guard';

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
    ],
  },
];
