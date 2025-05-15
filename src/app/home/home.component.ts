import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  isCartOpen = false;
  products = [
    { id: 1, name: 'Product 1', description: 'High-quality product', price: 29.99, image: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Product 2', description: 'Amazing deal', price: 49.99, image: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'Product 3', description: 'Limited offer', price: 19.99, image: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'Product 4', description: 'Best seller', price: 39.99, image: 'https://via.placeholder.com/300x200' }
  ];
  cartItems = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/300x200', quantity: 2 },
    { id: 2, name: 'Product 2', price: 49.99, image: 'https://via.placeholder.com/300x200', quantity: 1 }
  ];
}
