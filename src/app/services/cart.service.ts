import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/300x200', quantity: 2 },
    { id: 2, name: 'Product 2', price: 49.99, image: 'https://via.placeholder.com/300x200', quantity: 1 }
  ];

  getCartItems() {
    return this.cartItems;
  }

  addToCart(item: any) {
    const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push(item);
    }
  }

  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
  }

  clearCart() {
    this.cartItems = [];
  }
}
