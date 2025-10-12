// src/app/features/medicines/medicine-form/medicine-form.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedicineService } from '../../../core/services/medicine.service';
import { Medicine } from '../../../shared/models/medicine.model';

@Component({
  selector: 'app-medicine-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // 2. L'ajouter aux imports
  ],
  templateUrl: './medicine-form.component.html',
  styleUrls: ['./medicine-form.component.css']
})
export class MedicineFormComponent implements OnChanges {
  // 1. On crée un @Input pour recevoir le médicament à éditer.
  @Input() medicineToEdit: Medicine | null = null;

  medicineForm: FormGroup;
  isEditMode = false; // 2. Un booléen pour savoir si on est en mode édition.

  constructor(private fb: FormBuilder, private medicineService: MedicineService) {
    this.medicineForm = this.fb.group({
      id: [null], // 3. On ajoute l'ID au formulaire, il sera caché.
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      expirationDate: ['', Validators.required]
    });
  }

  // 4. Cette méthode est appelée chaque fois qu'un @Input change.
  ngOnChanges(changes: SimpleChanges): void {
    // Si 'medicineToEdit' a changé et n'est pas null...
    if (changes['medicineToEdit'] && this.medicineToEdit) {
      this.isEditMode = true;
      // 5. On remplit le formulaire avec les données du médicament.
      // patchValue est pratique car il ne se soucie pas si toutes les clés sont présentes.
      this.medicineForm.patchValue(this.medicineToEdit);
    }
  }

  onSubmit(): void {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    // 6. On vérifie si on est en mode édition ou en mode ajout.
    if (this.isEditMode) {
      // On appelle le service de mise à jour.
      this.medicineService.updateMedicine(this.medicineForm.value).subscribe({
        next: () => {
          console.log('Médicament mis à jour avec succès !');
          this.resetForm();
        }
      });
    } else {
      // On appelle le service d'ajout (logique existante).
      this.medicineService.addMedicine(this.medicineForm.value).subscribe({
        next: () => {
          console.log('Médicament ajouté avec succès !');
          this.resetForm();
        }
      });
    }
  }

  // 7. Une méthode pour réinitialiser le formulaire et le mode.
  resetForm(): void {
    this.medicineForm.reset();
    this.isEditMode = false;
    this.medicineToEdit = null;
  }
}