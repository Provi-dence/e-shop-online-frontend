import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/300x200', description: 'A great product', stock: 50 },
    { id: 2, name: 'Product 2', price: 49.99, image: 'https://via.placeholder.com/300x200', description: 'Another great product', stock: 20 }
  ];

  private nextId = 3;

  getProducts(): Observable<Product[]> {
    console.log('ProductService: Fetching products:', this.products);
    return of(this.products);
  }

  getProduct(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    console.log('ProductService: Fetching product id:', id, 'Found:', product);
    return of(product);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct = { ...product, id: this.nextId++, stock: product.stock || 0 };
    this.products.push(newProduct);
    console.log('ProductService: Added product:', newProduct);
    return of(newProduct);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...product };
      console.log('ProductService: Updated product id:', id, 'New data:', this.products[index]);
      return of(this.products[index]);
    }
    console.log('ProductService: Product id:', id, 'not found for update');
    return of(undefined);
  }

  deleteProduct(id: number): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      console.log('ProductService: Deleted product id:', id);
      return of(true);
    }
    console.log('ProductService: Product id:', id, 'not found for deletion');
    return of(false);
  }

  restockProduct(id: number, quantity: number): Observable<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1 && quantity >= 0) {
      this.products[index].stock += quantity;
      console.log('ProductService: Restocked product id:', id, 'New stock:', this.products[index].stock);
      return of(this.products[index]);
    }
    console.log('ProductService: Product id:', id, 'not found or invalid quantity');
    return of(undefined);
  }
}
