import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule, FormsModule],
  template: `
  <div class="checkout-page">
    <div class="co-topbar">
      <button class="back-btn" (click)="history.back()">
        <lucide-icon name="arrow-left" [size]="20"></lucide-icon>
      </button>
      <h1 class="topbar-title">Checkout</h1>
      <div style="width:36px"></div>
    </div>

    @if (!orderPlaced()) {
      <div class="container">
        <!-- Progress -->
        <div class="progress-steps">
          <div class="step" [class.active]="step() >= 1" [class.done]="step() > 1">
            <div class="step-circle">{{ step() > 1 ? '✓' : '1' }}</div>
            <div class="step-label">Address</div>
          </div>
          <div class="step-line" [class.done]="step() > 1"></div>
          <div class="step" [class.active]="step() >= 2" [class.done]="step() > 2">
            <div class="step-circle">{{ step() > 2 ? '✓' : '2' }}</div>
            <div class="step-label">Schedule</div>
          </div>
          <div class="step-line" [class.done]="step() > 2"></div>
          <div class="step" [class.active]="step() >= 3">
            <div class="step-circle">3</div>
            <div class="step-label">Payment</div>
          </div>
        </div>

        <!-- Step 1: Address -->
        @if (step() === 1) {
          <div class="step-content" @fadeIn>
            <h2 class="step-title">📍 Select Address</h2>
            <!-- Saved Addresses -->
            <div class="addresses">
              @for (addr of savedAddresses; track addr.id) {
                <div class="addr-card" [class.selected]="selectedAddress() === addr.id"
                  (click)="selectedAddress.set(addr.id)">
                  <div class="addr-radio">
                    <div class="radio-outer" [class.checked]="selectedAddress() === addr.id">
                      <div class="radio-inner"></div>
                    </div>
                  </div>
                  <div class="addr-info">
                    <div class="addr-type">{{ addr.type }}</div>
                    <div class="addr-text">{{ addr.text }}</div>
                  </div>
                </div>
              }
            </div>
            <button class="add-addr-btn">
              <lucide-icon name="plus" [size]="16"></lucide-icon>
              Add New Address
            </button>
          </div>
        }

        <!-- Step 2: Schedule -->
        @if (step() === 2) {
          <div class="step-content">
            <h2 class="step-title">📅 Select Date & Time</h2>
            <!-- Date Picker -->
            <div class="dates-scroll">
              @for (d of dates; track d.date) {
                <div class="date-pill" [class.selected]="selectedDate() === d.date"
                  (click)="selectedDate.set(d.date)">
                  <div class="dp-day">{{ d.day }}</div>
                  <div class="dp-num">{{ d.num }}</div>
                  <div class="dp-month">{{ d.month }}</div>
                </div>
              }
            </div>
            <!-- Time Slots -->
            <h3 class="sub-title">Select Time Slot</h3>
            <div class="slots-grid">
              @for (slot of timeSlots; track slot) {
                <div class="slot-pill" [class.selected]="selectedSlot() === slot"
                  (click)="selectedSlot.set(slot)">
                  {{ slot }}
                </div>
              }
            </div>
            <!-- Collection Type -->
            <div class="collection-card">
              <div class="cc-icon">🏠</div>
              <div>
                <div class="cc-title">Home Sample Collection</div>
                <div class="cc-sub">FREE · Trained phlebotomist visits you</div>
              </div>
              <div class="cc-check">✅</div>
            </div>
          </div>
        }

        <!-- Step 3: Payment -->
        @if (step() === 3) {
          <div class="step-content">
            <h2 class="step-title">💳 Payment Method</h2>
            <div class="payment-options">
              @for (pm of paymentMethods; track pm.id) {
                <div class="pm-card" [class.selected]="selectedPayment() === pm.id"
                  (click)="selectedPayment.set(pm.id)">
                  <div class="pm-radio">
                    <div class="radio-outer" [class.checked]="selectedPayment() === pm.id">
                      <div class="radio-inner"></div>
                    </div>
                  </div>
                  <div class="pm-emoji">{{ pm.emoji }}</div>
                  <div class="pm-info">
                    <div class="pm-name">{{ pm.name }}</div>
                    <div class="pm-sub">{{ pm.sub }}</div>
                  </div>
                  @if (pm.offer) { <span class="pm-offer">{{ pm.offer }}</span> }
                </div>
              }
            </div>
            <!-- Order Summary -->
            <div class="order-summary">
              <h3 class="os-title">Order Summary</h3>
              @for (item of data.cartItems(); track item.testId) {
                <div class="os-row">
                  <span>{{ item.testName }}</span>
                  <span>₹{{ item.discountedPrice }}</span>
                </div>
              }
              <div class="divider"></div>
              <div class="os-row total">
                <span>Total Payable</span>
                <span>₹{{ data.cartTotal() }}</span>
              </div>
            </div>
          </div>
        }

        <!-- Navigation Buttons -->
        <div class="nav-btns">
          @if (step() > 1) {
            <button class="btn btn-outline" (click)="prevStep()">← Back</button>
          }
          @if (step() < 3) {
            <button class="btn btn-primary" style="flex:1" (click)="nextStep()">
              Continue →
            </button>
          } @else {
            <button class="btn btn-primary" style="flex:1" (click)="placeOrder()">
              <lucide-icon name="check-circle" [size]="18"></lucide-icon>
              Pay ₹{{ data.cartTotal() }}
            </button>
          }
        </div>

        <div style="height:40px"></div>
      </div>
    } @else {
      <!-- Order Success -->
      <div class="success-page">
        <div class="success-animation">🎉</div>
        <h2 class="success-title">Booking Confirmed!</h2>
        <p class="success-sub">Our phlebotomist will arrive at your scheduled time</p>
        <div class="success-details">
          <div class="sd-row"><span>Order ID</span><span class="sd-val">ORD-{{ orderId() }}</span></div>
          <div class="sd-row"><span>Date</span><span class="sd-val">{{ selectedDate() }}</span></div>
          <div class="sd-row"><span>Time</span><span class="sd-val">{{ selectedSlot() }}</span></div>
          <div class="sd-row"><span>Payment</span><span class="sd-val green">Confirmed</span></div>
          <div class="sd-row total"><span>Amount Paid</span><span class="sd-val">₹{{ data.cartTotal() }}</span></div>
        </div>
        <div class="success-actions">
          <a routerLink="/dashboard" class="btn btn-primary btn-full">View My Orders</a>
          <a routerLink="/" class="btn btn-outline btn-full" style="margin-top:10px">Book Another Test</a>
        </div>
      </div>
    }
  </div>
  `,
  styles: [`
    .checkout-page { min-height: 100vh; background: var(--surface-2); }
    .co-topbar { background: #fff; border-bottom: 1px solid var(--border-light); padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: var(--header-height); z-index: 80; }
    .back-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    .topbar-title { font-size: 16px; font-weight: 700; }
    /* Progress */
    .progress-steps { display: flex; align-items: center; justify-content: center; padding: 20px 16px 8px; gap: 0; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .step-circle { width: 32px; height: 32px; border-radius: 50%; background: var(--border); color: var(--text-muted); font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .step.active .step-circle { background: var(--primary); color: #fff; box-shadow: var(--shadow-primary); }
    .step.done .step-circle { background: var(--secondary); color: #fff; }
    .step-label { font-size: 11px; font-weight: 600; color: var(--text-muted); }
    .step.active .step-label { color: var(--primary); }
    .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 4px; transition: var(--transition); max-width: 60px; }
    .step-line.done { background: var(--secondary); }
    /* Step Content */
    .step-content { padding: 16px 0; }
    .step-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 16px; }
    .sub-title { font-size: 14px; font-weight: 600; color: var(--text-secondary); margin: 12px 0 8px; }
    /* Addresses */
    .addresses { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
    .addr-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; border: 2px solid var(--border); cursor: pointer; transition: var(--transition); }
    .addr-card.selected { border-color: var(--primary); background: var(--primary-light); }
    .addr-radio { display: flex; align-items: flex-start; padding-top: 2px; }
    .radio-outer { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; transition: var(--transition); }
    .radio-outer.checked { border-color: var(--primary); }
    .radio-inner { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); display: none; }
    .radio-outer.checked .radio-inner { display: block; }
    .addr-type { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 4px; }
    .addr-text { font-size: 14px; color: var(--text-secondary); line-height: 1.4; }
    .add-addr-btn { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--primary); background: var(--primary-light); padding: 12px 16px; border-radius: var(--radius-lg); border: 2px dashed var(--primary); cursor: pointer; width: 100%; justify-content: center; }
    /* Dates */
    .dates-scroll { display: flex; gap: 10px; overflow-x: auto; padding: 4px 0 12px; }
    .dates-scroll::-webkit-scrollbar { display: none; }
    .date-pill { min-width: 64px; height: 80px; border-radius: var(--radius-lg); background: #fff; border: 2px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; cursor: pointer; transition: var(--transition); flex-shrink: 0; }
    .date-pill.selected { background: var(--primary); border-color: var(--primary); }
    .dp-day { font-size: 11px; font-weight: 600; color: var(--text-muted); }
    .dp-num { font-size: 22px; font-weight: 900; color: var(--text-primary); }
    .dp-month { font-size: 11px; color: var(--text-muted); }
    .date-pill.selected .dp-day, .date-pill.selected .dp-num, .date-pill.selected .dp-month { color: #fff; }
    /* Slots */
    .slots-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 16px; }
    @media (min-width: 480px) { .slots-grid { grid-template-columns: repeat(3, 1fr); } }
    .slot-pill { background: #fff; border: 2px solid var(--border); border-radius: var(--radius-md); padding: 12px 8px; text-align: center; font-size: 13px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: var(--transition); }
    .slot-pill.selected { background: var(--primary); border-color: var(--primary); color: #fff; }
    /* Collection Card */
    .collection-card { background: var(--secondary-light); border-radius: var(--radius-lg); padding: 14px 16px; display: flex; align-items: center; gap: 12px; }
    .cc-icon { font-size: 24px; }
    .cc-title { font-size: 14px; font-weight: 700; color: var(--secondary-dark); }
    .cc-sub { font-size: 12px; color: var(--secondary); }
    .cc-check { margin-left: auto; font-size: 22px; }
    /* Payment */
    .payment-options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
    .pm-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; align-items: center; gap: 12px; border: 2px solid var(--border); cursor: pointer; transition: var(--transition); }
    .pm-card.selected { border-color: var(--primary); background: var(--primary-light); }
    .pm-emoji { font-size: 24px; }
    .pm-name { font-size: 14px; font-weight: 700; color: var(--text-primary); }
    .pm-sub { font-size: 12px; color: var(--text-muted); }
    .pm-offer { margin-left: auto; font-size: 11px; font-weight: 700; background: var(--secondary-light); color: var(--secondary-dark); padding: 3px 8px; border-radius: 99px; }
    /* Order Summary */
    .order-summary { background: #fff; border-radius: var(--radius-lg); padding: 16px; }
    .os-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
    .os-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-secondary); padding: 6px 0; }
    .os-row.total { font-size: 16px; font-weight: 800; color: var(--text-primary); }
    /* Nav Buttons */
    .nav-btns { display: flex; gap: 10px; padding: 16px 0; }
    /* Success */
    .success-page { display: flex; flex-direction: column; align-items: center; padding: 48px 24px; text-align: center; gap: 12px; }
    .success-animation { font-size: 80px; animation: bounceIn .6s ease; }
    .success-title { font-size: 26px; font-weight: 900; color: var(--text-primary); }
    .success-sub { font-size: 15px; color: var(--text-secondary); max-width: 280px; }
    .success-details { background: #fff; border-radius: var(--radius-xl); padding: 20px; width: 100%; max-width: 400px; box-shadow: var(--shadow-sm); }
    .sd-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-light); font-size: 14px; color: var(--text-secondary); }
    .sd-row:last-child { border: none; }
    .sd-val { font-weight: 700; color: var(--text-primary); }
    .sd-val.green { color: var(--secondary); }
    .sd-row.total .sd-val { font-size: 18px; color: var(--primary); }
    .success-actions { width: 100%; max-width: 400px; }
  `]
})
export class CheckoutComponent {
  data = inject(LabDataService);
  router = inject(Router);
  history = window.history;

  step = signal(1);
  orderPlaced = signal(false);
  orderId = signal('');
  selectedAddress = signal('addr1');
  selectedDate = signal('');
  selectedSlot = signal('');
  selectedPayment = signal('upi');

  savedAddresses = [
    { id: 'addr1', type: '🏠 Home', text: 'A-14, Sector 62, Noida, Uttar Pradesh – 201301' },
    { id: 'addr2', type: '🏢 Office', text: 'Block B, DLF Cyber City, Gurugram, Haryana – 122002' },
  ];

  dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return {
      date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      num: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' })
    };
  });

  timeSlots = ['6:00 AM – 7:00 AM', '7:00 AM – 8:00 AM', '8:00 AM – 9:00 AM', '9:00 AM – 10:00 AM', '10:00 AM – 11:00 AM', '6:00 PM – 7:00 PM'];

  paymentMethods = [
    { id: 'upi', emoji: '📲', name: 'UPI Payment', sub: 'Google Pay, PhonePe, Paytm', offer: '5% Extra off' },
    { id: 'card', emoji: '💳', name: 'Credit / Debit Card', sub: 'All major cards accepted', offer: null },
    { id: 'cod', emoji: '💵', name: 'Pay at Lab (COD)', sub: 'Pay when sample is collected', offer: null },
  ];

  prevStep() {
    this.step.update(s => s - 1);
  }

  nextStep() {
    if (this.step() === 2 && !this.selectedDate()) { alert('Please select a date'); return; }
    if (this.step() === 2 && !this.selectedSlot()) { alert('Please select a time slot'); return; }
    this.step.update(s => s + 1);
  }

  placeOrder() {
    this.orderId.set(Math.floor(1000 + Math.random() * 9000).toString());
    this.data.clearCart();
    this.orderPlaced.set(true);
  }
}
