import { CanDeactivateFn } from '@angular/router';
import { ExperienceFormComponent } from '../../experiences/experience-form/experience-form.component';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

export const unsavedExperienceGuard: CanDeactivateFn<ExperienceFormComponent> = (component, currentRoute, currentState, nextState) => {
  const dialog = inject(MatDialog)

  /*if (component.experienceForm.dirty) {
    return dialog.open(ConfirmdialogComponent, {
      data: {
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Do you really want to leave?'
      }
    }).afterClosed()
  }*/

  return true;
};
