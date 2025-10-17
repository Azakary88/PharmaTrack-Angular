// src/app/features/medicines/medicine-list/medicine-list.component.ts
import { FormsModule } from '@angular/forms';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Medicine } from '../../../shared/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';
import { MedicineFormComponent } from '../medicine-form/medicine-form.component';


@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MedicineFormComponent,
  ],
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})

export class MedicineListComponent implements OnInit {
    // Observable qui contiendra la liste des médicaments filtrés
    public filteredMedicines$!: Observable<Medicine[]>;
    
    // Un sujet pour contenir le terme de recherche actuel
    public searchTerm = new BehaviorSubject<string>('');

    public selectedMedicine: Medicine | null = null;
    @ViewChild(MedicineFormComponent) medicineForm!: MedicineFormComponent;
    @ViewChild('formDialog') formDialog!: ElementRef<HTMLDialogElement>;

    constructor(private medicineService: MedicineService) {}

    // Utiliser le hook ngOnInit pour initialiser la logique de filtrage
    ngOnInit(): void {
      // On combine le flux de tous les médicaments avec le flux du terme de recherche
      this.filteredMedicines$ = combineLatest([
        this.medicineService.medicines$, // Le tableau complet des médicaments
        this.searchTerm.asObservable().pipe(startWith('')) // Le terme de recherche
      ]).pipe(
        map(([medicines, term]) => {
          // Si le terme est vide, on retourne toute la liste
          if (!term) {
            return medicines;
          }
          // Sinon, on filtre la liste
          return medicines.filter(med => 
            med.name.toLowerCase().includes(term.toLowerCase())
          );
        })
      );
    }

    // Méthode appelée à chaque changement dans le champ de recherche
    onSearchChange(term: string): void {
      this.searchTerm.next(term);
    }
       openAddModal(): void {
    // On appelle manuellement la méthode reset() du composant enfant
    if (this.medicineForm) {
      this.medicineForm.reset();
    }
    
    // On s'assure que selectedMedicine est null (ce qui est déjà le cas)
    this.selectedMedicine = null;
    
    // On ouvre la modale
    this.formDialog.nativeElement.showModal();
  }
  openEditModal(medicine: Medicine): void {
    // Le mode édition fonctionne déjà bien, pas de changement nécessaire ici
    this.selectedMedicine = medicine;
    this.formDialog.nativeElement.showModal();
  }

  closeModal(): void {
    this.formDialog.nativeElement.close();
    this.selectedMedicine = null;
  }

  onDelete(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
      this.medicineService.deleteMedicine(id).subscribe({
        next: () => console.log(`Suppression réussie pour l'ID ${id}`),
        error: (err) => console.error(`Erreur de suppression pour l'ID ${id}:`, err)
      });
    }
  }
}

