import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
import { filter, map, of, switchMap, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule,MatChipsModule,CommonModule,MatFormFieldModule,MatIconModule,MatButtonModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent implements OnInit{

  private readonly fb = inject(FormBuilder);
  private readonly cloudinaryService = inject(CloudinaryService);
  private readonly projectsService = inject(ProjectsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isEditMode = signal<boolean>(false);
  projectId = signal<string>('');

  readonly separatorKeysCodes = [ENTER, COMMA];
  techs = signal<Array<string>>([]);
  initialImages = signal<Array<string>>([]);
  deletedImages = signal<Array<string>>([]);
  selectedFiles = signal<File[]>([]);

  projectForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.required]],
    gitHubLink: ['', [Validators.required]],
    techs: [[] as string[], [Validators.required]],
    images: [[] as File[]],
    
  });

  ngOnInit(): void {
    this.route.paramMap
    .pipe(
      map(params => params.get('id')),
      tap(id => {
        if (id) {
          this.isEditMode.set(true);
          this.projectId.set(id);
        }
        else{
          this.projectForm.get('images')?.setValidators([Validators.required]);
        }
      }),
      filter(id => !!id),
      switchMap(id => this.projectsService.getProjectById(id!))
    )
    .subscribe(project => {
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        gitHubLink: project.gitHubLink,
        techs: project.techs,
        images: []
      });

      this.techs.set(project.techs);
      this.initialImages.set(project.images);
    });
  }

  onSubmit(){
    const { name, description, gitHubLink, techs, images } = this.projectForm.value;
    console.log(name,description,gitHubLink,techs,images)
    console.log(this.selectedFiles())

    const upload$ = images!.length > 0
    ? this.cloudinaryService.uploadImages(images!)
    : of([]);

    upload$.pipe(
      switchMap((uploadedUrls:string[]) => {
        const finalImages = [...this.initialImages(), ...uploadedUrls];
        const projectPayload = {
          name,
          description,
          gitHubLink,
          techs: this.techs(),
          images: finalImages
        };
        if (this.isEditMode()) {
          return this.projectsService.updateProject(this.projectId(), projectPayload as Project);
        } else {
          return this.projectsService.addProject(projectPayload as Project);
        }
      })
    ).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Failed to add/edit project:', err),
    })
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
    
    event.chipInput!.clear();
  }
  
  removeTech(tech: string): void {
    const updated = this.techs().filter(t => t !== tech);
    this.techs.set(updated);
    this.projectForm.get('techs')?.setValue(updated);
  }

  removeImage(url:string):void{
    this.initialImages.set(this.initialImages().filter(img => img != url));
    this.deletedImages.set([...this.deletedImages(),url]);
  }
  
}
