import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Vendor {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private vendors: Vendor[] = [
    { id: 1, name: 'Vendor 1', email: 'vendor1@example.com', status: 'pending', createdAt: '2025-05-01T10:00:00Z' },
    { id: 2, name: 'Vendor 2', email: 'vendor2@example.com', status: 'approved', createdAt: '2025-05-02T12:00:00Z' },
    { id: 3, name: 'Vendor 3', email: 'vendor3@example.com', status: 'pending', createdAt: '2025-05-03T14:00:00Z' }
  ];

  getVendors(): Observable<Vendor[]> {
    console.log('UserService: Fetching vendors:', this.vendors);
    return of(this.vendors);
  }

  updateVendorStatus(id: number, status: 'approved' | 'rejected'): Observable<boolean> {
    const vendor = this.vendors.find(v => v.id === id);
    if (vendor) {
      vendor.status = status;
      console.log('UserService: Updated vendor ID:', id, 'Status:', status);
      return of(true);
    }
    console.log('UserService: Vendor ID:', id, 'not found');
    return of(false);
  }
}
