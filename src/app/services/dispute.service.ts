import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Dispute {
  id: number;
  orderId: string;
  customerId: string;
  vendorId: string;
  description: string;
  status: 'open' | 'resolved' | 'escalated';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class DisputeService {
  private disputes: Dispute[] = [
    { id: 1, orderId: 'ORD001', customerId: 'CUST001', vendorId: 'VEND001', description: 'Product not delivered', status: 'open', createdAt: '2025-05-01T10:00:00Z' },
    { id: 2, orderId: 'ORD002', customerId: 'CUST002', vendorId: 'VEND002', description: 'Wrong item received', status: 'open', createdAt: '2025-05-02T12:00:00Z' },
    { id: 3, orderId: 'ORD003', customerId: 'CUST003', vendorId: 'VEND001', description: 'Damaged product', status: 'resolved', createdAt: '2025-05-03T14:00:00Z' }
  ];

  getDisputes(): Observable<Dispute[]> {
    console.log('DisputeService: Fetching disputes:', this.disputes);
    return of(this.disputes);
  }

  updateDisputeStatus(id: number, status: 'resolved' | 'escalated'): Observable<boolean> {
    const dispute = this.disputes.find(d => d.id === id);
    if (dispute) {
      dispute.status = status;
      console.log('DisputeService: Updated dispute ID:', id, 'Status:', status);
      return of(true);
    }
    console.log('DisputeService: Dispute ID:', id, 'not found');
    return of(false);
  }
}
