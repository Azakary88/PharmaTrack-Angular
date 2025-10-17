// src/app/core/services/sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Sale } from '../../shared/models/sale.model';
import { Medicine } from '../../shared/models/medicine.model';
import { MedicineService } from './medicine.service'; 

@Injectable({
  providedIn: 'root'
} )
export class SalesService {
  private salesApiUrl = 'http://localhost:3000/sales';


    // On crée un BehaviorSubject pour les ventes
  private salesSubject = new BehaviorSubject<Sale[]>([] );
  public sales$: Observable<Sale[]> = this.salesSubject.asObservable();

  // On injecte HttpClient et notre MedicineService
  constructor(
    private http: HttpClient,
    private medicineService: MedicineService
   ) { 
    // On charge les ventes initiales
    this.loadInitialSales();
   }

  private loadInitialSales(): void {
    this.http.get<Sale[]>(this.salesApiUrl ).subscribe(sales => {
      this.salesSubject.next(sales);
    });
  }

  /**
   * Enregistre une nouvelle vente et met à jour le stock du médicament.
   * @param saleData Les données de la vente (medicineId, quantity).
   * @param medicineToUpdate Le médicament concerné par la vente.
   */
  
  recordSale(saleData: { medicineId: string; quantity: number }, medicineToUpdate: Medicine): Observable<Sale> {
    // Calculer le nouveau stock
    const newQuantity = medicineToUpdate.quantity - saleData.quantity;

    // Préparer les données de la vente à envoyer à l'API
    const newSale: Omit<Sale, 'id'> = {
      medicineId: saleData.medicineId,
      quantity: saleData.quantity,
      saleDate: new Date().toISOString(), // On ajoute la date actuelle
      totalPrice: medicineToUpdate.price * saleData.quantity
    };

    // Mettre à jour le médicament (décrémenter le stock)
    this.medicineService.updateMedicine({ ...medicineToUpdate, quantity: newQuantity }).subscribe();

    // Enregistrer la vente dans l'historique des ventes
    return this.http.post<Sale>(this.salesApiUrl, newSale ).pipe(
      tap(saleFromApi => {
        const currentSales = this.salesSubject.getValue();
        this.salesSubject.next([...currentSales, saleFromApi]);
      })
    );
  }
}



