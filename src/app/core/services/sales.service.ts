// src/app/core/services/sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Sale } from '../../shared/models/sale.model';
import { Medicine } from '../../shared/models/medicine.model';
import { MedicineService } from './medicine.service'; 

@Injectable({
  providedIn: 'root'
} )
export class SalesService {
  private salesApiUrl = 'http://localhost:3000/sales';

  // On injecte HttpClient et notre MedicineService
  constructor(
    private http: HttpClient,
    private medicineService: MedicineService
   ) { }

  /**
   * Enregistre une nouvelle vente et met à jour le stock du médicament.
   * @param saleData Les données de la vente (medicineId, quantity).
   * @param medicineToUpdate Le médicament concerné par la vente.
   */
  
  recordSale(saleData: { medicineId: string; quantity: number }, medicineToUpdate: Medicine): Observable<Sale> {
    // 1. Calculer le nouveau stock
    const newQuantity = medicineToUpdate.quantity - saleData.quantity;

    // 2. Préparer les données de la vente à envoyer à l'API
    const newSale: Omit<Sale, 'id'> = {
      ...saleData,
      saleDate: new Date().toISOString(), // On ajoute la date actuelle
      totalPrice: medicineToUpdate.price * saleData.quantity
    };

    // 3. Mettre à jour le médicament (décrémenter le stock)
    // On utilise la méthode updateMedicine que nous avons déjà créée !
    this.medicineService.updateMedicine({ ...medicineToUpdate, quantity: newQuantity }).subscribe();

    // 4. Enregistrer la vente dans l'historique des ventes
    return this.http.post<Sale>(this.salesApiUrl, newSale );
  }
}
