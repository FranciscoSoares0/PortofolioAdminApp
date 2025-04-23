import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Experience } from '../interfaces/experience';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService {

  private readonly http = inject(HttpClient);

  myExperiences$ = new BehaviorSubject<Array<Experience>>([]);

  getExperiences() : Observable<Array<Experience>> {
      return this.http.get<Array<Experience>>('/experiences').pipe(
        tap((experiences) => {this.myExperiences$.next(experiences)})
      );
  }

  getExperienceById(experienceId : string) : Observable<Experience> {
      return this.http.get<Experience>(`/experiences/${experienceId}`);
  }

  addExperience(experienceData:Experience) : Observable<Experience> {
    return this.http.post<Experience>('/experiences', experienceData).pipe(
      tap((newExperience) => {
        const current = this.myExperiences$.value;
        this.myExperiences$.next([...current, newExperience]);
      })
    )
  }

  updateExperience(experienceId: string, experienceData: Experience): Observable<Experience> {
    return this.http.patch<Experience>(`/experiences/${experienceId}`, experienceData).pipe(
      tap((updatedExperience) => {
        const current = this.myExperiences$.value;
        const updatedExperiences = current.map(experience =>
          experience._id === experienceId ? updatedExperience : experience
        );
        this.myExperiences$.next(updatedExperiences);
      })
    );
  }
  

  deleteExperience(experienceId:string) : Observable<Experience>{
    return this.http.delete<Experience>(`/experiences/${experienceId}`).pipe(
      tap(() => {
        const updatedExperiences = this.myExperiences$.value.filter(p => p._id !== experienceId);
        this.myExperiences$.next(updatedExperiences);
      })
    )
  }
}
