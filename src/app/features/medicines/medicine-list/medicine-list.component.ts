// src/app/features/medicines/medicine-list/medicine-list.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Medicine } from '../../../shared/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';
import { MedicineFormComponent } from '../medicine-form/medicine-form.component';
import { SalesRecorderComponent } from '../../sales/sales-recorder/sales-recorder.component';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [
    CommonModule, 
    MedicineFormComponent,
    SalesRecorderComponent,
  ],
  templateUrl: './medicine-list.component.html', // Vérifiez que ce nom correspond
  styleUrls: ['./medicine-list.component.css']   // Vérifiez que ce nom correspond
})

export class MedicineListComponent {
  public medicines$: Observable<Medicine[]>;
  // 1. Une variable pour garder en mémoire le médicament sélectionné pour l'édition.
  public selectedMedicine: Medicine | null = null;

  constructor(private medicineService: MedicineService) {
    this.medicines$ = this.medicineService.medicines$;
  }

  // 2. Méthode appelée quand on clique sur "Modifier".
  onEdit(medicine: Medicine): void {
    this.selectedMedicine = medicine;
  }

  /**
   * Gère le clic sur le bouton "Supprimer".
   * @param id L'ID (string) du médicament à supprimer.
   */
  onDelete(id: string): void {
    // On demande confirmation à l'utilisateur
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      // On appelle le service avec le paramètre 'id' qui est bien une string
      this.medicineService.deleteMedicine(id).subscribe({
        next: () => {
          console.log(`Médicament avec l'ID ${id} supprimé avec succès.`);
        },
        error: (err) => {
          console.error(`Erreur lors de la suppression du médicament ${id}:`, err);
        }
      });
    }
 }

}