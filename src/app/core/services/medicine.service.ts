// src/app/core/services/medicine.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Medicine } from '../../shared/models/medicine.model';

@Injectable({
  providedIn: 'root'
} )
export class MedicineService {
  private apiUrl = 'http://localhost:3000/medicines';

  // 1. On crée un BehaviorSubject.
  // C'est un type de Subject qui garde en mémoire la dernière valeur émise.
  // Il est initialisé avec un tableau vide.
  private medicinesSubject = new BehaviorSubject<Medicine[]>([] );

  // 2. On expose un Observable public.
  // Les composants vont écouter cet Observable. Ils ne peuvent pas y pousser de données.
  public medicines$: Observable<Medicine[]> = this.medicinesSubject.asObservable();

  constructor(private http: HttpClient ) {
    // 3. On charge les données initiales dès que le service est créé.
    this.loadInitialMedicines();
  }

  private loadInitialMedicines(): void {
    this.http.get<Medicine[]>(this.apiUrl ).subscribe(medicines => {
      // 4. On pousse la liste initiale dans notre Subject.
      this.medicinesSubject.next(medicines);
    });
  }

// DANS LE FICHIER: src/app/core/services/medicine.service.ts
// REMPLACEZ addMedicine PAR CETTE VERSION DÉFINITIVE

  addMedicine(formData: { name: string, category: string, price: number, quantity: number, expirationDate: string }): Observable<Medicine> {
    
    // ÉTAPE 1 : CRÉATION D'UN OBJET JAVASCRIPT SIMPLE ET PUR
    // On n'utilise plus de types complexes comme Omit<...>.
    // On crée un objet littéral simple, ce que json-server comprend le mieux.
    const plainJavaScriptObject = {
      name: formData.name,
      category: formData.category,
      price: formData.price,
      quantity: formData.quantity,
      expirationDate: formData.expirationDate
    };

    // Log pour vérifier l'objet JUSTE AVANT l'envoi.
    console.log("--- OBJET ENVOYÉ À L'API ---", plainJavaScriptObject);

    // ÉTAPE 2 : ENVOI DE CET OBJET SIMPLE
    // On envoie cet objet pur à l'API.
    return this.http.post<Medicine>(this.apiUrl, plainJavaScriptObject ).pipe(
      
      // 'tap' reçoit la réponse du serveur ('medicineFromApi')
      tap(medicineFromApi => {
        
        // Log pour vérifier la réponse de l'API. On s'attend à voir un ID ici.
        console.log("--- RÉPONSE REÇUE DE L'API ---", medicineFromApi);

        // ÉTAPE 3 : MISE À JOUR DE LA LISTE LOCALE
        // On met à jour notre liste locale avec la réponse complète de l'API.
        const currentMedicines = this.medicinesSubject.getValue();
        this.medicinesSubject.next([...currentMedicines, medicineFromApi]);
      })
    );
  }


  updateMedicine(medicineData: Medicine): Observable<Medicine> {
    // On envoie les données du formulaire
    return this.http.put<Medicine>(`${this.apiUrl}/${medicineData.id}`, medicineData ).pipe(
      // 'tap' reçoit la réponse de l'API : 'updatedMedicineFromApi'
      tap(updatedMedicineFromApi => {
        const currentMedicines = this.medicinesSubject.getValue();
        // On cherche l'index en se basant sur l'ID de la réponse de l'API
        const index = currentMedicines.findIndex(m => m.id === updatedMedicineFromApi.id);
        if (index !== -1) {
          // On remplace l'ancien objet par la nouvelle version reçue de l'API
          currentMedicines[index] = updatedMedicineFromApi;
          this.medicinesSubject.next([...currentMedicines]);
        }
      })
    );
  }

  // La méthode deleteMedicine que vous avez est déjà correcte.
  deleteMedicine(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}` ).pipe(
      tap(() => {
        const currentMedicines = this.medicinesSubject.getValue();
        const updatedMedicines = currentMedicines.filter(med => med.id !== id);
        this.medicinesSubject.next(updatedMedicines);
      })
    );
  }

}

