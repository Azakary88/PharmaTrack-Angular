// src/app/features/dashboard/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Medicine } from '../../../shared/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';
import { Sale } from '../../../shared/models/sale.model';
import { SalesService } from '../../../core/services/sales.service'; // Assurez-vous que ce service existe

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Observable pour les médicaments en rupture de stock
  public lowStockMedicines$!: Observable<Medicine[]>;

  // Nouveaux observables pour nos statistiques
  public dailyRevenue$!: Observable<number>;
  public dailySalesCount$!: Observable<number>;

  constructor(
    private medicineService: MedicineService,
    private salesService: SalesService 
  ) {}

  ngOnInit(): void {
    // On utilise l'observable 'medicines$' du service
    this.lowStockMedicines$ = this.medicineService.medicines$.pipe(
      // L'opérateur 'map' transforme les données
      map(medicines => 
        // On filtre le tableau pour ne garder que les médicaments avec une quantité < 10
        medicines.filter(med => med.quantity < 10)
      )
    );

    // 4. On utilise l'observable 'sales$' du service
    const todaysSales$ = this.salesService.sales$.pipe(
      map(sales => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée (minuit)

        // On filtre les ventes pour ne garder que celles d'aujourd'hui
        return sales.filter(sale => new Date(sale.saleDate) >= today);
      })
    );

    // 5. On calcule le chiffre d'affaires du jour
    this.dailyRevenue$ = todaysSales$.pipe(
      map(sales => 
        // On utilise reduce pour additionner le 'totalPrice' de chaque vente
        sales.reduce((total, sale) => total + sale.totalPrice, 0)
      )
    );

    // 6. On calcule le nombre de ventes du jour
    this.dailySalesCount$ = todaysSales$.pipe(
      map(sales => sales.length) // C'est simplement la longueur du tableau des ventes du jour
    );
  }
}
