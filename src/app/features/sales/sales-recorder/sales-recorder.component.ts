import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { Medicine } from '../../../shared/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';
import { SalesService } from '../../../core/services/sales.service';

@Component({
  selector: 'app-sales-recorder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sales-recorder.component.html',
  styleUrls: ['./sales-recorder.component.css']
})

export class SalesRecorderComponent implements OnInit { // On peut garder OnInit
  saleForm: FormGroup;
  medicines$: Observable<Medicine[]>;
  // Une variable pour stocker la liste complète des médicaments une fois chargée
  private allMedicines: Medicine[] = [];

  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private salesService: SalesService
  ) {
    this.medicines$ = this.medicineService.medicines$;

    this.saleForm = this.fb.group({
      medicineId: [{ value: null, disabled: true }, Validators.required], // 1. Désactivé par défaut
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

    ngOnInit(): void {
      // 2. On s'abonne ici pour charger les données et activer le formulaire
      this.medicines$.subscribe(medicines => {
        if (medicines && medicines.length > 0) {
          this.allMedicines = medicines; // On stocke la liste
          this.saleForm.get('medicineId')?.enable(); // On active le champ de sélection
        }
      });
    }

      onSubmit(): void {
    if (this.saleForm.invalid) {
      return;
    }

    const formValue = this.saleForm.value;
    // 1. On garde l'ID tel quel, c'est une chaîne de caractères et c'est parfait.
    const medicineId = formValue.medicineId; 
    const quantity = formValue.quantity;

    // On peut même supprimer le bloc de débogage maintenant.

    // 2. On cherche en comparant string avec string.
    const selectedMedicine = this.allMedicines.find(m => m.id === medicineId);

    if (!selectedMedicine) {
      console.error('La recherche a échoué. ID cherché :', medicineId);
      alert('Erreur : Le médicament sélectionné est introuvable. Veuillez rafraîchir.');
      return;
    }

    if (selectedMedicine.quantity < quantity) {
      alert('Stock insuffisant !');
      return;
    }

    // 3. On passe l'ID (string) au service.
    this.salesService.recordSale({ medicineId: medicineId, quantity }, selectedMedicine).subscribe({
      next: () => {
        alert('Vente enregistrée avec succès !');
        this.saleForm.reset({ medicineId: { value: null, disabled: false }, quantity: 1 });
      },
      error: (err) => console.error("Erreur lors de l'enregistrement de la vente :", err)
    });
  }
}