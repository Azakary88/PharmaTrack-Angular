// src/app/features/sales/sales-page/sales-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// On importe le composant qui contient la logique de vente
import { SalesRecorderComponent } from '../sales-recorder/sales-recorder.component';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  // On s'assure d'importer le SalesRecorderComponent
  imports: [CommonModule, SalesRecorderComponent],
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.css']
})
export class SalesPageComponent {

}
