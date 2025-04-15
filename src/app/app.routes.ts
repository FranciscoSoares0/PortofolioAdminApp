import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { NotFoundComponent } from './layout/not-found/not-found.component';

export const routes: Routes = [
    { 
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () => import('./layout/layout.routes').then(r => r.routes)
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(r => r.routes)
    },
    {
        path: '**',
        component: NotFoundComponent, 
      }
];
