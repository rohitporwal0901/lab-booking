import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';
import { LabTest, LabCategory } from '../../../core/models/lab-test.model';

@Component({
  selector: 'app-category-tests',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  <div class="cat-page">
    <!-- Hero Header -->
    @if (category()) {
      <div class="cat-hero" [style.background]="category()!.bgGradient">
        <div class="container">
          <button class="back-btn" (click)="history.back()">
            <lucide-icon name="arrow-left" [size]="20"></lucide-icon>
          </button>
          <div class="cat-hero-content">
            <div class="cat-hero-emoji">{{ category()!.emoji }}</div>
            <div>
              <h1 class="cat-hero-title">{{ category()!.name }}</h1>
              <p class="cat-hero-desc">{{ category()!.description }}</p>
              <div class="cat-hero-count">{{ tests().length }} tests available</div>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="container">
      <!-- Tests List -->
      <div class="tests-list">
        @for (test of tests(); track test.id) {
          <div class="tl-card">
            <div class="tl-card-left">
              <div class="tl-header">
                <div class="tl-badges">
                  @if (test.popular) { <span class="badge badge-danger">🔥 Popular</span> }
                  @if (test.recommended) { <span class="badge badge-primary">⭐ Recommended</span> }
                  @if (test.homeCollection) { <span class="badge badge-success">🏠 Home Collection</span> }
                </div>
              </div>
              <div class="tl-name">{{ test.name }}</div>
              <div class="tl-lab">
                <lucide-icon name="hospital" [size]="13"></lucide-icon>
                {{ test.labName }}
              </div>
              <div class="tl-meta-row">
                <span class="meta-chip">
                  <lucide-icon name="clock" [size]="12"></lucide-icon>
                  Report in {{ test.duration }}
                </span>
                @if (test.fastingRequired) {
                  <span class="meta-chip warning">⏱ Fasting Required</span>
                } @else {
                  <span class="meta-chip success">✅ No Fasting</span>
                }
              </div>
              <div class="tl-params">
                @for (p of test.parameters.slice(0,3); track p) {
                  <span class="param-tag">{{ p }}</span>
                }
                @if (test.parameters.length > 3) {
                  <span class="param-more">+{{ test.parameters.length - 3 }} more</span>
                }
              </div>
              <div class="tl-stars">
                @for (s of getStars(test.rating); track $index) {
                  <span>{{ s }}</span>
                }
                <span class="tl-reviews">({{ test.totalReviews | number }})</span>
              </div>
            </div>

            <div class="tl-card-right">
              <div class="tl-price">₹{{ test.discountedPrice }}</div>
              @if (test.discountPercent > 0) {
                <div class="tl-mrp">₹{{ test.price }}</div>
                <div class="tl-off">{{ test.discountPercent }}% OFF</div>
              }
              <button class="tl-add-btn"
                [class.added]="data.isInCart(test.id)"
                (click)="addToCart(test)">
                @if (data.isInCart(test.id)) {
                  <lucide-icon name="check" [size]="14"></lucide-icon> Added
                } @else {
                  <lucide-icon name="plus" [size]="14"></lucide-icon> Add
                }
              </button>
              <a [routerLink]="['/test', test.id]" class="tl-view-link">View Details</a>
            </div>
          </div>
        }

        @if (tests().length === 0) {
          <div class="empty-state">
            <div class="emoji">🔬</div>
            <h3>No tests found</h3>
            <p>Tests for this category coming soon!</p>
          </div>
        }
      </div>

      <div style="height:24px"></div>
    </div>

    <!-- Bottom Cart Strip -->
    @if (data.cartCount() > 0) {
      <div class="cart-strip">
        <div class="cs-left">
          <span class="cs-count">{{ data.cartCount() }} test(s) added</span>
          <span class="cs-total">₹{{ data.cartTotal() }}</span>
        </div>
        <a routerLink="/cart" class="cs-btn">View Cart →</a>
      </div>
    }

    @if (showToast()) {
      <div class="cart-toast">
        <lucide-icon name="check-circle" [size]="18"></lucide-icon>
        Added to cart!
      </div>
    }
  </div>
  `,
  styles: [`
    .cat-page { min-height: 100vh; }
    .cat-hero { padding: 16px 0 24px; }
    .back-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.7); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; margin-bottom: 16px; color: var(--text-primary); backdrop-filter: blur(8px); }
    .cat-hero-content { display: flex; align-items: center; gap: 16px; }
    .cat-hero-emoji { font-size: 52px; flex-shrink: 0; }
    .cat-hero-title { font-size: 22px; font-weight: 800; color: var(--text-primary); }
    .cat-hero-desc { font-size: 13px; color: var(--text-secondary); margin: 4px 0; }
    .cat-hero-count { display: inline-block; font-size: 11px; font-weight: 700; background: rgba(255,255,255,.8); color: var(--primary-dark); padding: 3px 10px; border-radius: 99px; }
    /* Tests List */
    .tests-list { display: flex; flex-direction: column; gap: 12px; padding: 16px 0; }
    .tl-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); transition: var(--transition); }
    .tl-card:hover { box-shadow: var(--shadow-md); }
    .tl-card-left { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .tl-card-right { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 90px; padding-left: 12px; border-left: 1px solid var(--border-light); }
    .tl-header { display: flex; align-items: center; justify-content: space-between; }
    .tl-badges { display: flex; gap: 6px; flex-wrap: wrap; }
    .tl-name { font-size: 15px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
    .tl-lab { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
    .tl-meta-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .meta-chip { font-size: 11px; padding: 3px 8px; background: var(--surface-3); border-radius: 99px; color: var(--text-secondary); display: flex; align-items: center; gap: 4px; }
    .meta-chip.warning { background: #fef3c7; color: #b45309; }
    .meta-chip.success { background: #d1fae5; color: #065f46; }
    .tl-params { display: flex; gap: 6px; flex-wrap: wrap; }
    .param-tag { font-size: 10px; background: var(--primary-light); color: var(--primary-dark); padding: 2px 8px; border-radius: 99px; font-weight: 500; }
    .param-more { font-size: 10px; color: var(--text-muted); padding: 2px 6px; }
    .tl-stars { display: flex; align-items: center; gap: 2px; font-size: 13px; }
    .tl-reviews { font-size: 11px; color: var(--text-muted); margin-left: 4px; }
    .tl-price { font-size: 22px; font-weight: 800; color: var(--text-primary); text-align: center; }
    .tl-mrp { font-size: 12px; color: var(--text-muted); text-decoration: line-through; }
    .tl-off { font-size: 11px; font-weight: 700; color: var(--secondary); background: var(--secondary-light); padding: 2px 8px; border-radius: 99px; }
    .tl-add-btn { width: 100%; padding: 10px 0; border-radius: var(--radius-sm); background: linear-gradient(135deg,var(--primary),var(--primary-dark)); color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 6px; transition: var(--transition); box-shadow: var(--shadow-primary); }
    .tl-add-btn.added { background: var(--secondary); }
    .tl-view-link { font-size: 11px; font-weight: 600; color: var(--primary); text-decoration: none; margin-top: 4px; text-align: center; }
    .tl-view-link:hover { text-decoration: underline; }
    /* Cart Strip */
    .cart-strip { position: fixed; bottom: calc(var(--bottom-nav-height) + 8px); left: 12px; right: 12px; background: #0f172a; border-radius: var(--radius-lg); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; z-index: 90; box-shadow: 0 8px 32px rgba(0,0,0,.3); animation: slideUp .3s ease; }
    .cs-left { display: flex; flex-direction: column; }
    .cs-count { font-size: 12px; color: #94a3b8; }
    .cs-total { font-size: 18px; font-weight: 800; color: #fff; }
    .cs-btn { background: linear-gradient(135deg,var(--primary),var(--secondary)); color: #fff; font-size: 14px; font-weight: 700; padding: 10px 20px; border-radius: var(--radius-sm); text-decoration: none; }
    /* Toast */
    .cart-toast { position: fixed; bottom: calc(var(--bottom-nav-height) + 80px); left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; font-size: 14px; font-weight: 600; padding: 12px 20px; border-radius: 99px; display: flex; align-items: center; gap: 8px; z-index: 999; animation: slideUp 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,.3); }
  `]
})
export class CategoryTestsComponent implements OnInit {
  data = inject(LabDataService);
  private route = inject(ActivatedRoute);
  history = window.history;

  category = signal<LabCategory | undefined>(undefined);
  tests = signal<LabTest[]>([]);
  showToast = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.category.set(this.data.getCategoryById(id));
    this.tests.set(this.data.getTestsByCategory(id));
  }

  getStars(rating: number): string[] {
    const full = Math.floor(rating);
    return Array(5).fill('').map((_, i) => i < full ? '⭐' : '☆');
  }

  addToCart(test: LabTest) {
    this.data.addToCart(test);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2000);
  }
}
