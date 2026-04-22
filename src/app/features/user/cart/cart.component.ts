import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  <div class="cart-page">
    <div class="cart-topbar">
      <button class="back-btn" (click)="history.back()">
        <lucide-icon name="arrow-left" [size]="20"></lucide-icon>
      </button>
      <h1 class="topbar-title">My Cart</h1>
      @if (data.cartCount() > 0) {
        <button class="clear-btn-sm" (click)="data.clearCart()">Clear All</button>
      }
    </div>

    <div class="container">
      @if (data.cartItems().length === 0) {
        <div class="empty-state" style="margin-top:60px">
          <div class="emoji">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add tests from the home page or browse categories.</p>
          <a routerLink="/" class="btn btn-primary" style="margin-top:16px">Browse Tests</a>
        </div>
      } @else {
        <!-- Cart Items -->
        <div class="cart-items">
          @for (item of data.cartItems(); track item.testId) {
            <div class="cart-item">
              <div class="ci-info">
                <div class="ci-name">{{ item.testName }}</div>
                <div class="ci-lab">
                  <lucide-icon name="hospital" [size]="12"></lucide-icon>
                  {{ item.labName }}
                </div>
                @if (item.homeCollection) {
                  <span class="ci-tag">🏠 Home Collection Available</span>
                }
              </div>
              <div class="ci-right">
                <div class="ci-price">₹{{ item.discountedPrice }}</div>
                @if (item.price !== item.discountedPrice) {
                  <div class="ci-mrp">₹{{ item.price }}</div>
                }
                <button class="ci-remove" (click)="data.removeFromCart(item.testId)">
                  <lucide-icon name="trash-2" [size]="16"></lucide-icon>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Offer Input -->
        <div class="offer-card">
          <div class="offer-input-row">
            <lucide-icon name="tag" [size]="18" style="color:var(--primary)"></lucide-icon>
            <input type="text" placeholder="Apply coupon code" class="offer-input" />
            <button class="apply-btn">Apply</button>
          </div>
        </div>

        <!-- Bill Summary -->
        <div class="bill-card">
          <h3 class="bill-title">Bill Summary</h3>
          <div class="bill-rows">
            <div class="bill-row">
              <span>MRP Total</span>
              <span>₹{{ mrpTotal() }}</span>
            </div>
            <div class="bill-row discount">
              <span>Total Discount</span>
              <span>–₹{{ mrpTotal() - data.cartTotal() }}</span>
            </div>
            <div class="bill-row">
              <span>Home Collection Fee</span>
              <span class="free">FREE</span>
            </div>
            <div class="divider"></div>
            <div class="bill-row total">
              <span>Total Payable</span>
              <span>₹{{ data.cartTotal() }}</span>
            </div>
            <div class="savings-pill">
              🎉 You're saving ₹{{ mrpTotal() - data.cartTotal() }} on this order!
            </div>
          </div>
        </div>

        <!-- Home Collection Info -->
        <div class="info-card">
          <lucide-icon name="info" [size]="18" style="color:var(--primary)"></lucide-icon>
          <p>All tests include <strong>FREE home sample collection</strong>. Our trained phlebotomist will visit you at your preferred time slot.</p>
        </div>

        <div style="height:100px"></div>
      }
    </div>

    <!-- Checkout Bar -->
    @if (data.cartItems().length > 0) {
      <div class="checkout-bar">
        <div class="cb-price">
          <div class="cb-total">₹{{ data.cartTotal() }}</div>
          <div class="cb-items">{{ data.cartCount() }} test(s)</div>
        </div>
        <a routerLink="/checkout" class="cb-btn">
          Proceed to Book
          <lucide-icon name="arrow-right" [size]="18"></lucide-icon>
        </a>
      </div>
    }
  </div>
  `,
  styles: [`
    .cart-page { min-height: 100vh; background: var(--surface-2); }
    .cart-topbar { background: #fff; border-bottom: 1px solid var(--border-light); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: var(--header-height); z-index: 80; }
    .back-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    .topbar-title { font-size: 16px; font-weight: 700; flex: 1; text-align: center; }
    .clear-btn-sm { font-size: 13px; font-weight: 600; color: var(--danger); background: none; border: none; cursor: pointer; }
    /* Cart Items */
    .cart-items { display: flex; flex-direction: column; gap: 10px; padding: 16px 0 12px; }
    .cart-item { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); align-items: flex-start; }
    .ci-info { flex: 1; }
    .ci-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
    .ci-lab { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
    .ci-tag { font-size: 11px; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 99px; font-weight: 500; }
    .ci-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .ci-price { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .ci-mrp { font-size: 12px; color: var(--text-muted); text-decoration: line-through; }
    .ci-remove { width: 32px; height: 32px; border-radius: 50%; background: #fee2e2; color: var(--danger); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; margin-top: 4px; }
    /* Offer */
    .offer-card { background: #fff; border-radius: var(--radius-lg); padding: 14px 16px; margin-bottom: 10px; box-shadow: var(--shadow-sm); }
    .offer-input-row { display: flex; align-items: center; gap: 10px; }
    .offer-input { flex: 1; border: none; outline: none; font-size: 14px; color: var(--text-primary); background: transparent; }
    .apply-btn { font-size: 13px; font-weight: 700; color: var(--primary); background: none; border: none; cursor: pointer; }
    /* Bill */
    .bill-card { background: #fff; border-radius: var(--radius-lg); padding: 18px 16px; margin-bottom: 10px; box-shadow: var(--shadow-sm); }
    .bill-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 14px; }
    .bill-rows { display: flex; flex-direction: column; gap: 10px; }
    .bill-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-secondary); }
    .bill-row.discount { color: var(--secondary); font-weight: 600; }
    .bill-row.total { font-size: 16px; font-weight: 800; color: var(--text-primary); }
    .free { color: var(--secondary); font-weight: 700; }
    .savings-pill { text-align: center; background: linear-gradient(135deg,#d1fae5,#a7f3d0); color: #065f46; font-size: 13px; font-weight: 700; padding: 10px; border-radius: var(--radius-sm); margin-top: 6px; }
    /* Info */
    .info-card { background: var(--primary-light); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
    .info-card p { font-size: 13px; color: var(--primary-dark); line-height: 1.5; }
    /* Checkout Bar */
    .checkout-bar { position: fixed; bottom: var(--bottom-nav-height); left: 0; right: 0; background: #fff; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 -4px 20px rgba(0,0,0,.1); z-index: 80; }
    .cb-price { display: flex; flex-direction: column; }
    .cb-total { font-size: 22px; font-weight: 900; color: var(--text-primary); }
    .cb-items { font-size: 12px; color: var(--text-muted); }
    .cb-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg,var(--primary),var(--primary-dark)); color: #fff; font-size: 15px; font-weight: 700; padding: 14px 24px; border-radius: var(--radius-lg); text-decoration: none; box-shadow: var(--shadow-primary); }
  `]
})
export class CartComponent {
  data = inject(LabDataService);
  history = window.history;
  router = inject(Router);

  mrpTotal() {
    return this.data.cartItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
