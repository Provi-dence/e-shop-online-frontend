import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  paymentMethod: string = 'card'; // Default to card
  cardDetails = { number: '', expMonth: '', expYear: '', cvc: '' };
  paymentStatus: string | null = null;
  isLoading = false;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    console.log('CheckoutComponent initialized. Cart items:', this.cartItems);
  }

  calculateTotal(): number {
    const total = this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    //console.log('Calculated total:', total);
    return total;
  }

  validateCardDetails(): boolean {
    if (this.paymentMethod !== 'card') return true;
    const { number, expMonth, expYear, cvc } = this.cardDetails;
    const isValid =
      number.replace(/\s/g, '').length === 16 &&
      /^\d{2}$/.test(expMonth) &&
      /^\d{2}$/.test(expYear) &&
      /^\d{3,4}$/.test(cvc);
    if (!isValid) {
      this.paymentStatus = 'Invalid card details. Please check and try again.';
    }
    return isValid;
  }

  initiatePayment() {
    console.log('Initiating payment with method:', this.paymentMethod);
    if (this.cartItems.length === 0) {
      this.paymentStatus = 'Cart is empty';
      console.warn('Payment aborted: Cart is empty');
      return;
    }

    if (this.paymentMethod === 'card' && !this.validateCardDetails()) {
      console.warn('Payment aborted: Invalid card details');
      return;
    }

    this.isLoading = true;
    this.paymentStatus = null;
    const amount = Math.round(this.calculateTotal() * 100); // PayMongo expects amount in centavos
    console.log('Payment amount (centavos):', amount);

    // Create Payment Intent
    const paymentIntentData = {
      data: {
        attributes: {
          amount,
          currency: 'PHP',
          payment_method_allowed: [this.paymentMethod],
          description: 'E-Shop Checkout'
        }
      }
    };

    this.http
      .post('https://api.paymongo.com/v1/payment_intents', paymentIntentData, {
        headers: {
          Authorization: `Basic ${btoa(environment.paymongoPublicKey + ':')}`,
          'Content-Type': 'application/json'
        }
      })
      .subscribe({
        next: (response: any) => {
          console.log('Payment Intent created:', response);
          const intentId = response.data.id;
          const clientKey = response.data.attributes.client_key;

          // For card payments, attach payment method
          if (this.paymentMethod === 'card') {
            this.attachCardPayment(intentId, clientKey);
          } else {
            // Handle other payment methods (e.g., GCash, Maya)
            this.handleRedirectPayment(response.data.attributes.next_action, intentId);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.paymentStatus = 'Payment initiation failed. Please try again.';
          console.error('Payment Intent Error:', error);
        }
      });
  }

  attachCardPayment(intentId: string, clientKey: string) {
    console.log('Attaching card payment for intent:', intentId);
    // Create Payment Method
    const paymentMethodData = {
      data: {
        attributes: {
          type: 'card',
          details: {
            card_number: this.cardDetails.number.replace(/\s/g, ''),
            exp_month: parseInt(this.cardDetails.expMonth),
            exp_year: parseInt(this.cardDetails.expYear),
            cvc: this.cardDetails.cvc
          }
        }
      }
    };

    this.http
      .post('https://api.paymongo.com/v1/payment_methods', paymentMethodData, {
        headers: {
          Authorization: `Basic ${btoa(environment.paymongoPublicKey + ':')}`,
          'Content-Type': 'application/json'
        }
      })
      .subscribe({
        next: (methodResponse: any) => {
          console.log('Payment Method created:', methodResponse);
          const paymentMethodId = methodResponse.data.id;

          // Attach Payment Method to Intent
          this.http
            .post(
              `https://api.paymongo.com/v1/payment_intents/${intentId}/attach`,
              {
                data: {
                  attributes: {
                    payment_method: paymentMethodId,
                    client_key: clientKey
                  }
                }
              },
              {
                headers: {
                  Authorization: `Basic ${btoa(environment.paymongoPublicKey + ':')}`,
                  'Content-Type': 'application/json'
                }
              }
            )
            .subscribe({
              next: (attachResponse: any) => {
                this.isLoading = false;
                console.log('Payment Intent attached:', attachResponse);
                if (attachResponse.data.attributes.status === 'succeeded') {
                  this.paymentStatus = 'Payment successful!';
                  this.cartService.clearCart();
                  console.log('Cart cleared after successful payment');
                } else {
                  this.paymentStatus = 'Payment failed. Please try again.';
                  console.warn('Payment failed:', attachResponse);
                }
              },
              error: (error) => {
                this.isLoading = false;
                this.paymentStatus = 'Payment attachment failed';
                console.error('Attach Payment Error:', error);
              }
            });
        },
        error: (error) => {
          this.isLoading = false;
          this.paymentStatus = 'Card details invalid';
          console.error('Payment Method Error:', error);
        }
      });
  }

  handleRedirectPayment(nextAction: any, intentId: string) {
    console.log('Handling redirect payment for intent:', intentId, 'Next action:', nextAction);
    if (nextAction && nextAction.redirect && nextAction.redirect.url) {
      window.location.href = nextAction.redirect.url;
      console.log('Redirecting to:', nextAction.redirect.url);
    } else {
      this.isLoading = false;
      this.paymentStatus = 'Redirect payment not available';
      console.warn('Redirect payment failed: No redirect URL');
    }
  }

  initiateCOD() {
    console.log('Initiating Cash on Delivery');
    this.paymentStatus = 'Cash on Delivery selected. Order confirmed!';
    this.cartService.clearCart();
    console.log('Cart cleared after COD confirmation');
  }
}
