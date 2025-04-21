import { CanDeactivateFn } from '@angular/router';
import { ProjectFormComponent } from '../../projects/project-form/project-form.component';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';


export const unsavedProjectGuard: CanDeactivateFn<ProjectFormComponent> = (component, currentRoute, currentState, nextState) => {
  const dialog = inject(MatDialog)

  if (component.projectForm.dirty) {
    return dialog.open(ConfirmdialogComponent, {
      data: {
        title: 'Unsaved changes',
        message: 'You have unsaved changes. Do you really want to leave?'
      }
    }).afterClosed()
  }

  return true;
};
