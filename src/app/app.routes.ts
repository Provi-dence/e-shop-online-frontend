import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ShopComponent } from './shop/shop.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { VendorComponent } from './vendor/vendor.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },

  // user
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'checkout', component: CheckoutComponent },

  // vendor
  { path: 'vendor', component: VendorComponent },
  { path: 'vendor-dashboard', component: VendorDashboardComponent},

  // admin
  { path: 'admin', component: AdminComponent}
];
