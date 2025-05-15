import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product, ProductService } from '../services/product.service';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  products: Product[] = [];
  newProduct: Partial<Product> = { name: '', price: 0, image: '', description: '', stock: 0 };
  editMode = false;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      console.log('VendorComponent: Products loaded:', products);
    });
  }

  isFormValid(): boolean {
    return (
      this.newProduct.name?.trim() !== '' &&
      (this.newProduct.price ?? 0) > 0 &&
      this.newProduct.image?.trim() !== '' &&
      this.newProduct.description?.trim() !== '' &&
      (this.newProduct.stock ?? 0) >= 0
    );
  }

  saveProduct() {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.editMode && this.newProduct.id) {
      this.productService.updateProduct(this.newProduct.id, this.newProduct).subscribe(product => {
        if (product) {
          console.log('VendorComponent: Updated product:', product);
          this.loadProducts();
          this.resetForm();
        }
      });
    } else {
      this.productService.addProduct(this.newProduct as Omit<Product, 'id'>).subscribe(product => {
        console.log('VendorComponent: Added product:', product);
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: Product) {
    this.newProduct = { ...product };
    this.editMode = true;
  }

  cancelEdit() {
    this.resetForm();
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(success => {
        if (success) {
          console.log('VendorComponent: Deleted product ID:', id);
          this.loadProducts();
        }
      });
    }
  }

  resetForm() {
    this.newProduct = { name: '', price: 0, image: '', description: '', stock: 0 };
    this.editMode = false;
  }
}
