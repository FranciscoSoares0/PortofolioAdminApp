import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperiencesDisplayComponent } from './experiences-display.component';

describe('ExperiencesDisplayComponent', () => {
  let component: ExperiencesDisplayComponent;
  let fixture: ComponentFixture<ExperiencesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperiencesDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperiencesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
