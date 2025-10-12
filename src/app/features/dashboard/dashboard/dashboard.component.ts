// src/app/features/dashboard/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Medicine } from '../../../shared/models/medicine.model';
import { MedicineService } from '../../../core/services/medicine.service';
import { Sale } from '../../../shared/models/sale.model';
import { SalesService } from '../../../core/services/sales.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Observable pour les médicaments en rupture de stock
  public lowStockMedicines$!: Observable<Medicine[]>;

  // Nouveaux observables pour nos statistiques
  public dailyRevenue$!: Observable<number>;
  public dailySalesCount$!: Observable<number>;
  public salesChartData: any[] = [];

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

    // On utilise l'observable 'sales$' du service
    const todaysSales$ = this.salesService.sales$.pipe(
      map(sales => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée (minuit)

        // On filtre les ventes pour ne garder que celles d'aujourd'hui
        return sales.filter(sale => new Date(sale.saleDate) >= today);
      })
    );

    //  On calcule le chiffre d'affaires du jour
    this.dailyRevenue$ = todaysSales$.pipe(
      map(sales => 
        // On utilise reduce pour additionner le 'totalPrice' de chaque vente
        sales.reduce((total, sale) => total + sale.totalPrice, 0)
      )
    );

    //  On calcule le nombre de ventes du jour
    this.dailySalesCount$ = todaysSales$.pipe(
      map(sales => sales.length) // C'est simplement la longueur du tableau des ventes du jour
    );

    
    this.salesService.sales$.subscribe(sales => {
      const weeklySales = [
        { name: 'Dim', value: 0 }, { name: 'Lun', value: 0 }, { name: 'Mar', value: 0 },
        { name: 'Mer', value: 0 }, { name: 'Jeu', value: 0 }, { name: 'Ven', value: 0 },
        { name: 'Sam', value: 0 }
      ];

      if (Array.isArray(sales)) {
        sales.forEach(sale => {
          const saleDate = new Date(sale.saleDate);
          if (!isNaN(saleDate.getTime())) {
            const saleDay = saleDate.getDay();
            const price = sale.totalPrice;
            if (typeof price === 'number' && !isNaN(price)) {
              weeklySales[saleDay].value += price;
            }
          }
        });
      }

      //  On assigne le résultat final à notre propriété de classe.
      // L'astuce [...weeklySales] force Angular à détecter le changement.
        setTimeout(() => {
        this.salesChartData = [...weeklySales];
        console.log("Données assignées au graphique (avec setTimeout):", this.salesChartData);
      }, 0);
    });
  }
}
