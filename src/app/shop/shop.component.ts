import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  items = [
    { id: 1, name: 'Item 1', description: 'Premium quality item', price: 29.99, image: 'https://via.placeholder.com/300x200' },
    { id: 2, name: 'Item 2', description: 'Great value product', price: 49.99, image: 'https://via.placeholder.com/300x200' },
    { id: 3, name: 'Item 3', description: 'Limited edition', price: 19.99, image: 'https://via.placeholder.com/300x200' },
    { id: 4, name: 'Item 4', description: 'Best seller', price: 39.99, image: 'https://via.placeholder.com/300x200' },
    { id: 5, name: 'Item 5', description: 'New arrival', price: 59.99, image: 'https://via.placeholder.com/300x200' }
  ];
  sortOption = 'name-asc';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.sortItems();
  }

  sortItems() {
    if (this.sortOption === 'name-asc') {
      this.items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.items.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.sortOption === 'price-asc') {
      this.items.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-desc') {
      this.items.sort((a, b) => b.price - a.price);
    }
  }

  addToCart(item: any) {
    this.cartService.addToCart({ ...item, quantity: 1 });
  }
}
