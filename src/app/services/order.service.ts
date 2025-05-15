import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
  items: { productId: number; name: string; quantity: number; price: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders: Order[] = [
    {
      id: 1,
      customerName: 'John Doe',
      total: 89.97,
      status: 'Completed',
      date: '2025-05-10',
      items: [
        { productId: 1, name: 'Product 1', quantity: 2, price: 29.99 },
        { productId: 2, name: 'Product 2', quantity: 1, price: 49.99 }
      ]
    },
    {
      id: 2,
      customerName: 'Jane Smith',
      total: 29.99,
      status: 'Pending',
      date: '2025-05-11',
      items: [{ productId: 1, name: 'Product 1', quantity: 1, price: 29.99 }]
    }
  ];

  getOrders(): Observable<Order[]> {
    console.log('OrderService: Fetching orders:', this.orders);
    return of(this.orders);
  }

  getOrder(id: number): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === id);
    console.log('OrderService: Fetching order id:', id, 'Found:', order);
    return of(order);
  }

  updateOrderStatus(id: number, status: Order['status']): Observable<boolean> {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      console.log('OrderService: Updated order id:', id, 'Status:', status);
      return of(true);
    }
    console.log('OrderService: Order id:', id, 'not found');
    return of(false);
  }

  getEarnings(): Observable<{ total: number; transactions: { orderId: number; amount: number; date: string }[] }> {
    const total = this.orders
      .filter(o => o.status === 'Completed')
      .reduce((sum, o) => sum + o.total, 0);
    const transactions = this.orders
      .filter(o => o.status === 'Completed')
      .map(o => ({ orderId: o.id, amount: o.total, date: o.date }));
    console.log('OrderService: Calculated earnings:', { total, transactions });
    return of({ total, transactions });
  }
}
