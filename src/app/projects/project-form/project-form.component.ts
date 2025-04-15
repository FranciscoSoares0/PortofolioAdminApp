import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CloudinaryService } from '../services/cloudinary.service';
import { ProjectsService } from '../services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../interfaces/project';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { map, switchMap } from 'rxjs';


@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule,MatChipsModule,CommonModule,MatFormFieldModule,MatIconModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {

  private readonly fb = inject(FormBuilder);
  private readonly cloudinaryService = inject(CloudinaryService);
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  queryParams$ = inject(ActivatedRoute).queryParams;

  project$ = this.route.queryParams.pipe(
    map(params => params['id']),
    switchMap(id => this.projectsService.getProjectById(id!))
  );

  constructor(){
    this.project$.subscribe(project => {
      if (!project) return;
  
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        gitHubLink: project.gitHubLink,
        techs: project.techs,
        images: []  // Keep empty — you're not re-uploading images
      });
  
      this.techs.set(project.techs); // sync chip values
    });
  }

  readonly separatorKeysCodes = [ENTER, COMMA];
  techs = signal<Array<string>>([]);
  selectedFiles = signal<File[]>([]);

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    gitHubLink: ['', [Validators.required]],
    techs: [[] as string[], [Validators.required]],
    images: [[] as File[], [Validators.required]],
    
  });

  onSubmit(){
    const { name, description, gitHubLink, techs, images } = this.projectForm.value;
    console.log(name,description,gitHubLink,techs,images)
    console.log(this.selectedFiles())

    this.cloudinaryService.uploadImages(images!).subscribe({
      next: (imageUrls) => {
        const projectPayload = {
          name,
          description,
          gitHubLink,
          techs : this.techs(),
          images: imageUrls
        };
  
        this.projectsService.addProject(projectPayload as Project).subscribe({
          next: () => this.router.navigate(['/']),
          error: (err) => console.error('Failed to post project:', err),
        });
      },
      error: (err) => console.error('Cloudinary upload failed:', err),
    });
  }

  onFilesSelected(event: Event){
    const target = event.target as HTMLInputElement;
    if (!target.files) return;
    const filesArray = Array.from(target.files);
    this.selectedFiles.set(filesArray);
    this.projectForm.get('images')?.setValue(filesArray);
    this.projectForm.get('images')?.markAsTouched();
  }

  getImagePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  addTech(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.techs().includes(value)) {
      const updated = [...this.techs(), value];
      this.techs.set(updated);
      this.projectForm.get('techs')?.setValue(updated);
      this.projectForm.get('techs')?.markAsTouched();
    }
    // Clear the input
    event.chipInput!.clear();
  }
  
  removeTech(tech: string): void {
    const updated = this.techs().filter(t => t !== tech);
    this.techs.set(updated);
    this.projectForm.get('techs')?.setValue(updated);
  }
  
}
