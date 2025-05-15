import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { UserService, Vendor } from '../services/user.service';
import { DisputeService, Dispute } from '../services/dispute.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  stats = {
    totalVendors: 0,
    totalProducts: 0,
    pendingVendors: 0,
    openDisputes: 0
  };
  vendors: Vendor[] = [];
  disputes: Dispute[] = [];
  selectedDispute: Dispute | null = null;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private disputeService: DisputeService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadVendors();
    this.loadDisputes();
  }

  loadStats() {
    this.userService.getVendors().subscribe(vendors => {
      this.stats.totalVendors = vendors.length;
      this.stats.pendingVendors = vendors.filter(v => v.status === 'pending').length;
      console.log('AdminComponent: Vendors loaded:', vendors);
    });
    this.productService.getProducts().subscribe(products => {
      this.stats.totalProducts = products.length;
      console.log('AdminComponent: Products loaded:', products);
    });
    this.disputeService.getDisputes().subscribe(disputes => {
      this.stats.openDisputes = disputes.filter(d => d.status === 'open').length;
      console.log('AdminComponent: Disputes loaded:', disputes);
    });
  }

  loadVendors() {
    this.userService.getVendors().subscribe(vendors => {
      this.vendors = vendors;
    });
  }

  loadDisputes() {
    this.disputeService.getDisputes().subscribe(disputes => {
      this.disputes = disputes;
    });
  }

  approveVendor(id: number) {
    this.userService.updateVendorStatus(id, 'approved').subscribe(success => {
      if (success) {
        console.log('AdminComponent: Approved vendor ID:', id);
        this.loadVendors();
        this.loadStats();
      }
    });
  }

  rejectVendor(id: number) {
    if (confirm('Are you sure you want to reject this vendor?')) {
      this.userService.updateVendorStatus(id, 'rejected').subscribe(success => {
        if (success) {
          console.log('AdminComponent: Rejected vendor ID:', id);
          this.loadVendors();
          this.loadStats();
        }
      });
    }
  }

  openDisputeModal(dispute: Dispute) {
    this.selectedDispute = dispute;
    const modal = document.getElementById('dispute-modal') as HTMLDialogElement;
    modal.showModal();
  }

  closeDisputeModal() {
    this.selectedDispute = null;
    const modal = document.getElementById('dispute-modal') as HTMLDialogElement;
    modal.close();
  }

  resolveDispute(id: number) {
    this.disputeService.updateDisputeStatus(id, 'resolved').subscribe(success => {
      if (success) {
        console.log('AdminComponent: Resolved dispute ID:', id);
        this.loadDisputes();
        this.loadStats();
        this.closeDisputeModal();
      }
    });
  }

  escalateDispute(id: number) {
    this.disputeService.updateDisputeStatus(id, 'escalated').subscribe(success => {
      if (success) {
        console.log('AdminComponent: Escalated dispute ID:', id);
        this.loadDisputes();
        this.loadStats();
        this.closeDisputeModal();
      }
    });
  }
}
