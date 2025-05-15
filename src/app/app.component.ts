import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ecommerce';

  isCartOpen = false;
  products = [
    { id: 1, name: 'Product 1', description: 'High-quality product', price: 29.99, image: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Product 2', description: 'Amazing deal', price: 49.99, image: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'Product 3', description: 'Limited offer', price: 19.99, image: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'Product 4', description: 'Best seller', price: 39.99, image: 'https://via.placeholder.com/300x200' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {}

  get cartItems() {
    return this.cartService.getCartItems();
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  removeFromCart(item: any) {
    this.cartService.removeFromCart(item);
  }

  debugClicked(event: Event) {
    event.preventDefault();
    console.log('Debug button clicked');
    console.log('Current cart items:', this.cartItems);
    console.log('Total price:', this.calculateTotal());

    this.router.navigate(['/checkout']);

    this.isCartOpen = false;

  }
}
