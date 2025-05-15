import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../services/product.service';
import { OrderService, Order } from '../services/order.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  earnings: { total: number; transactions: { orderId: number; amount: number; date: string }[] } = { total: 0, transactions: [] };
  selectedOrder: Order | null = null;
  selectedProduct: Product | null = null;
  restockQuantity: number = 0;

  constructor(private productService: ProductService, private orderService: OrderService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      console.log('VendorDashboard: Products loaded:', products);
    });

    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      console.log('VendorDashboard: Orders loaded:', orders);
    });

    this.orderService.getEarnings().subscribe(earnings => {
      this.earnings = earnings;
      console.log('VendorDashboard: Earnings loaded:', earnings);
    });
  }

  openOrderModal(order: Order) {
    this.selectedOrder = { ...order };
    const modal = document.getElementById('order-modal') as HTMLDialogElement;
    modal.showModal();
  }

  closeOrderModal() {
    this.selectedOrder = null;
    const modal = document.getElementById('order-modal') as HTMLDialogElement;
    modal.close();
  }

  updateOrderStatus() {
    if (this.selectedOrder) {
      this.orderService.updateOrderStatus(this.selectedOrder.id, this.selectedOrder.status).subscribe(success => {
        if (success) {
          this.loadData();
        }
      });
    }
  }

  openRestockModal(product: Product) {
    this.selectedProduct = product;
    this.restockQuantity = 0;
    const modal = document.getElementById('restock-modal') as HTMLDialogElement;
    modal.showModal();
  }

  closeRestockModal() {
    this.selectedProduct = null;
    this.restockQuantity = 0;
    const modal = document.getElementById('restock-modal') as HTMLDialogElement;
    modal.close();
  }

  restockProduct() {
    if (this.selectedProduct && this.restockQuantity > 0) {
      this.productService.restockProduct(this.selectedProduct.id, this.restockQuantity).subscribe(product => {
        if (product) {
          this.loadData();
          this.closeRestockModal();
        }
      });
    }
  }
}
