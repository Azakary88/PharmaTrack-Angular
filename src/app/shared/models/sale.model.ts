// src/app/shared/models/sale.model.ts
export interface Sale {
  id: string;
  medicineId: string;
  quantity: number;
  saleDate: string;
  totalPrice: number;
}
