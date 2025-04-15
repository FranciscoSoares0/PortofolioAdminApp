import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private readonly http = inject(HttpClient);

  myProjects$ = new BehaviorSubject<Array<Project>>([]);

  getProjects() : Observable<Array<Project>> {
      return this.http.get<Array<Project>>('/projects').pipe(
        tap((projects) => {this.myProjects$.next(projects);console.log(projects)})
      );
  }

  getProjectById(projectId : string) : Observable<Project> {
      console.log(projectId)
      return this.http.get<Project>(`/projects/${projectId}`);
  }

  addProject(projectData:Project) : Observable<Project> {
    return this.http.post<Project>('/projects', projectData).pipe(
      tap((newProject) => {
        const current = this.myProjects$.value;
        this.myProjects$.next([...current, newProject]);
      })
    )
  }

  updateProject(projectId: string, updatedData: Project): Observable<Project> {
    return this.http.patch<Project>(`/projects/${projectId}`, updatedData).pipe(
      tap((updatedProject) => {
        const current = this.myProjects$.value;
        const updatedProjects = current.map(project =>
          project._id === projectId ? updatedProject : project
        );
        this.myProjects$.next(updatedProjects);
      })
    );
  }
  

  deleteProject(projectId:string) : Observable<Project>{
    return this.http.delete<Project>(`/projects/${projectId}`).pipe(
      tap(() => {
        const updatedProjects = this.myProjects$.value.filter(p => p._id !== projectId);
        this.myProjects$.next(updatedProjects);
      })
    )
  }
}
