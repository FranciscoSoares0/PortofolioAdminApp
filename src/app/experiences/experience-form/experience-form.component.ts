import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExperiencesService } from '../services/experiences.service';
import { ActivatedRoute, Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { filter, map, switchMap, tap } from 'rxjs';
import { Experience } from '../interfaces/experience';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-experience-form',
  imports: [ReactiveFormsModule,MatChipsModule,CommonModule,MatFormFieldModule,MatIconModule,MatButtonModule],
  templateUrl: './experience-form.component.html',
  styleUrl: './experience-form.component.css',
})
export class ExperienceFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly experiencesService = inject(ExperiencesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = signal<boolean>(false);
  experienceId = signal<string>('');

  readonly separatorKeysCodes = [ENTER, COMMA];
  techs = signal<Array<string>>([]);

  experienceForm = this.fb.group({
    dates: ['', [Validators.required]],
    position: ['', [Validators.required]],
    company: ['', [Validators.required]],
    description: ['', [Validators.required]],
    techs: [[] as string[], [Validators.required]],
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        tap((id) => {
          if (id) {
            this.isEditMode.set(true);
            this.experienceId.set(id);
          }
        }),
        filter((id) => !!id),
        switchMap((id) => this.experiencesService.getExperienceById(id!))
      )
      .subscribe((experience) => {
        this.experienceForm.patchValue({
          dates: experience.dates,
          position: experience.position,
          company: experience.company,
          description: experience.description,
          techs: experience.techs,
        });

        this.techs.set(experience.techs);
      });
  }

  onSubmit() {
    const { dates, position, company, description, techs } =
      this.experienceForm.value;

    const experiencePayload = {
      dates,
      position,
      company,
      description,
      techs: this.techs(),
    };

    this.experienceForm.markAsPristine();
    if (this.isEditMode()) {
      return this.experiencesService.updateExperience(
        this.experienceId(),
        experiencePayload as Experience
      ).subscribe({
        next: () => this.router.navigate(['/experiences']),
        error: (err) => console.error('Failed to edit experience:', err),
      });
    } else {
      return this.experiencesService.addExperience(experiencePayload as Experience).subscribe({
        next: () => this.router.navigate(['/experiences']),
        error: (err) => console.error('Failed to add experience:', err),
      });
    }
  }

  addTech(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.techs().includes(value)) {
      const updated = [...this.techs(), value];
      this.techs.set(updated);
      this.experienceForm.get('techs')?.setValue(updated);
      this.experienceForm.get('techs')?.markAsTouched();
    }

    event.chipInput!.clear();
  }

  removeTech(tech: string): void {
    const updated = this.techs().filter((t) => t !== tech);
    this.techs.set(updated);
    this.experienceForm.get('techs')?.setValue(updated);
  }
}
