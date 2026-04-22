import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';
import { LabTest } from '../../../core/models/lab-test.model';

@Component({
  selector: 'app-test-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  @if (test()) {
    <div class="detail-page">
      <!-- Back + Share Header -->
      <div class="detail-topbar">
        <button class="back-btn" (click)="history.back()">
          <lucide-icon name="arrow-left" [size]="20"></lucide-icon>
        </button>
        <h1 class="topbar-title">Test Details</h1>
        <button class="share-btn">
          <lucide-icon name="share-2" [size]="18"></lucide-icon>
        </button>
      </div>

      <div class="container">
        <!-- Hero Card -->
        <div class="hero-card">
          <div class="hero-top">
            <div class="hero-badges">
              @if (test()!.popular) { <span class="badge badge-danger">🔥 Popular</span> }
              @if (test()!.recommended) { <span class="badge badge-primary">⭐ Recommended</span> }
            </div>
            <span class="badge badge-purple">{{ test()!.category }}</span>
          </div>
          <h2 class="hero-name">{{ test()!.name }}</h2>
          <div class="hero-lab">
            <lucide-icon name="hospital" [size]="14"></lucide-icon>
            {{ test()!.labName }}
          </div>
          <div class="hero-rating">
            @for (s of getStars(test()!.rating); track $index) { <span>{{ s }}</span> }
            <span class="rating-score">{{ test()!.rating }}</span>
            <span class="rating-count">({{ test()!.totalReviews | number }} reviews)</span>
          </div>
          <div class="hero-meta-grid">
            <div class="meta-box">
              <lucide-icon name="clock" [size]="20" class="meta-icon"></lucide-icon>
              <div class="meta-val">{{ test()!.duration }}</div>
              <div class="meta-key">Report Time</div>
            </div>
            <div class="meta-box">
              <span style="font-size:20px">{{ test()!.fastingRequired ? '⏱' : '✅' }}</span>
              <div class="meta-val">{{ test()!.fastingRequired ? 'Required' : 'Not Required' }}</div>
              <div class="meta-key">Fasting</div>
            </div>
            <div class="meta-box">
              <span style="font-size:20px">🏠</span>
              <div class="meta-val">{{ test()!.homeCollection ? 'Available' : 'Not Available' }}</div>
              <div class="meta-key">Home Collection</div>
            </div>
            <div class="meta-box">
              <span style="font-size:20px">📄</span>
              <div class="meta-val">{{ test()!.reportDelivery }}</div>
              <div class="meta-key">Report Delivery</div>
            </div>
          </div>

          <!-- Price -->
          <div class="hero-price-row">
            <div>
              <div class="hero-price">₹{{ test()!.discountedPrice }}</div>
              @if (test()!.discountPercent > 0) {
                <div class="hero-discount-row">
                  <span class="hero-mrp">₹{{ test()!.price }}</span>
                  <span class="badge badge-success">{{ test()!.discountPercent }}% OFF</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="detail-card">
          <h3 class="dc-title">📋 About This Test</h3>
          <p class="dc-text">{{ test()!.description }}</p>
        </div>

        <!-- Preparation -->
        <div class="detail-card">
          <h3 class="dc-title">🥗 How To Prepare</h3>
          <p class="dc-text">{{ test()!.preparation }}</p>
        </div>

        <!-- Parameters -->
        <div class="detail-card">
          <h3 class="dc-title">🔬 Parameters Included ({{ test()!.parameters.length }})</h3>
          <div class="params-grid">
            @for (p of test()!.parameters; track p; let i = $index) {
              <div class="param-item">
                <lucide-icon name="check-circle" [size]="16" class="param-check"></lucide-icon>
                <span>{{ p }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Reviews -->
        @if (test()!.reviews.length > 0) {
          <div class="detail-card">
            <h3 class="dc-title">⭐ Customer Reviews</h3>
            <div class="reviews-list">
              @for (rev of test()!.reviews; track rev.id) {
                <div class="review-card">
                  <div class="rev-header">
                    <div class="rev-avatar">{{ rev.avatar }}</div>
                    <div>
                      <div class="rev-name">{{ rev.userName }}</div>
                      <div class="rev-stars">
                        @for (s of getStars(rev.rating); track $index) { <span>{{ s }}</span> }
                      </div>
                    </div>
                    <div class="rev-date">{{ rev.date }}</div>
                  </div>
                  <p class="rev-comment">{{ rev.comment }}</p>
                </div>
              }
            </div>
          </div>
        }

        <div style="height:100px"></div>
      </div>

      <!-- Sticky Bottom Bar -->
      <div class="sticky-bottom">
        <div class="sb-price">
          <div class="sb-amount">₹{{ test()!.discountedPrice }}</div>
          @if (test()!.discountPercent > 0) {
            <div class="sb-mrp">₹{{ test()!.price }}</div>
          }
        </div>
        <button class="sb-btn"
          [class.added]="data.isInCart(test()!.id)"
          (click)="addToCart()">
          @if (data.isInCart(test()!.id)) {
            <lucide-icon name="shopping-cart" [size]="18"></lucide-icon>
            Go to Cart
          } @else {
            <lucide-icon name="plus" [size]="18"></lucide-icon>
            Book Now
          }
        </button>
      </div>
    </div>
  }
  `,
  styles: [`
    .detail-page { min-height: 100vh; background: var(--surface-2); }
    .detail-topbar { position: sticky; top: var(--header-height); z-index: 80; background: #fff; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
    .back-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    .topbar-title { font-size: 16px; font-weight: 700; flex: 1; text-align: center; }
    .share-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    /* Hero */
    .hero-card { background: #fff; border-radius: var(--radius-xl); padding: 20px; margin: 16px 0 12px; box-shadow: var(--shadow-sm); }
    .hero-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .hero-badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .hero-name { font-size: 20px; font-weight: 800; color: var(--text-primary); margin-bottom: 6px; line-height: 1.3; }
    .hero-lab { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-muted); margin-bottom: 8px; }
    .hero-rating { display: flex; align-items: center; gap: 4px; font-size: 14px; margin-bottom: 16px; }
    .rating-score { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-left: 4px; }
    .rating-count { font-size: 12px; color: var(--text-muted); }
    .hero-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: var(--surface-2); border-radius: var(--radius-lg); padding: 14px; margin-bottom: 16px; }
    @media (max-width: 400px) { .hero-meta-grid { grid-template-columns: repeat(2, 1fr); } }
    .meta-box { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
    .meta-icon { color: var(--primary); }
    .meta-val { font-size: 11px; font-weight: 700; color: var(--text-primary); }
    .meta-key { font-size: 10px; color: var(--text-muted); }
    .hero-price-row { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--border-light); }
    .hero-price { font-size: 28px; font-weight: 900; color: var(--text-primary); }
    .hero-discount-row { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
    .hero-mrp { font-size: 14px; color: var(--text-muted); text-decoration: line-through; }
    /* Detail Cards */
    .detail-card { background: #fff; border-radius: var(--radius-lg); padding: 18px; margin-bottom: 12px; box-shadow: var(--shadow-sm); }
    .dc-title { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; }
    .dc-text { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
    /* Params */
    .params-grid { display: flex; flex-direction: column; gap: 8px; }
    .param-item { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; color: var(--text-secondary); }
    .param-check { color: var(--secondary); flex-shrink: 0; margin-top: 1px; }
    /* Reviews */
    .reviews-list { display: flex; flex-direction: column; gap: 12px; }
    .review-card { background: var(--surface-2); border-radius: var(--radius-md); padding: 14px; }
    .rev-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .rev-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .rev-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .rev-stars { display: flex; gap: 2px; font-size: 12px; }
    .rev-date { margin-left: auto; font-size: 11px; color: var(--text-muted); }
    .rev-comment { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    /* Sticky Bottom */
    .sticky-bottom { position: fixed; bottom: var(--bottom-nav-height); left: 0; right: 0; background: #fff; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 -4px 20px rgba(0,0,0,.1); z-index: 80; }
    .sb-price { display: flex; flex-direction: column; }
    .sb-amount { font-size: 24px; font-weight: 900; color: var(--text-primary); }
    .sb-mrp { font-size: 13px; color: var(--text-muted); text-decoration: line-through; }
    .sb-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg,var(--primary),var(--primary-dark)); color: #fff; font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: var(--radius-lg); border: none; cursor: pointer; box-shadow: var(--shadow-primary); transition: var(--transition); }
    .sb-btn.added { background: linear-gradient(135deg,var(--secondary),var(--secondary-dark)); }
    .sb-btn:active { transform: scale(.97); }
  `]
})
export class TestDetailComponent implements OnInit {
  data = inject(LabDataService);
  private route = inject(ActivatedRoute);
  history = window.history;
  test = signal<LabTest | undefined>(undefined);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.test.set(this.data.getTestById(id));
  }

  getStars(rating: number) {
    return Array(5).fill('').map((_, i) => i < Math.floor(rating) ? '⭐' : '☆');
  }

  addToCart() {
    if (this.test()) this.data.addToCart(this.test()!);
  }
}
