// src/app/features/medicines/medicine-form/medicine-form.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
  @Input() medicineToEdit: Medicine | null = null;
  @Output() formClosed = new EventEmitter<void>();

  medicineForm: FormGroup;
  isEditMode = false;

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
 public reset(): void {
    this.isEditMode = false;
    this.medicineForm.reset();
  }
    ngOnChanges(changes: SimpleChanges): void {
      // On vérifie si la propriété 'medicineToEdit' a changé
      if (changes['medicineToEdit']) {
        if (this.medicineToEdit) {
          // Si on reçoit un médicament, on passe en mode édition
          this.isEditMode = true;
          this.medicineForm.patchValue(this.medicineToEdit);
        } else {
          // Si on ne reçoit RIEN (null), on passe en mode ajout et on nettoie le formulaire
          this.isEditMode = false;
          this.medicineForm.reset(); 
          this.reset;
        }
      }
    }


  onSubmit(): void {
    if (this.medicineForm.invalid) { return; }

    const action$ = this.isEditMode
      ? this.medicineService.updateMedicine(this.medicineForm.value)
      : this.medicineService.addMedicine(this.medicineForm.value);

    action$.subscribe({
      next: () => {
        console.log(this.isEditMode ? 'Mise à jour réussie' : 'Ajout réussi');
        this.formClosed.emit(); // On demande juste la fermeture
      }
    });
  }

  cancel(): void {
    this.formClosed.emit();
  }
  
  // --- NOUVELLE MÉTHODE DE RÉINITIALISATION ---
  private resetForm(): void {
    this.medicineForm.reset(); // Réinitialise les valeurs du formulaire
    this.isEditMode = false;   // Repasse en mode "ajout"
  }
}


