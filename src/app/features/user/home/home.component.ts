import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
  <div class="home-page">
    <!-- Search Bar -->
    <div class="search-section">
      <div class="container">
        <div class="search-wrap">
          <lucide-icon name="search" [size]="18" class="search-icon"></lucide-icon>
          <input
            type="text"
            placeholder="Search tests (Blood Test, CBC, Thyroid…)"
            class="search-input"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
          />
          @if (searchQuery()) {
            <button class="clear-btn" (click)="searchQuery.set(''); searchResults.set([])">✕</button>
          }
        </div>
        <!-- Search Results Dropdown -->
        @if (searchResults().length > 0) {
          <div class="search-results">
            @for (test of searchResults(); track test.id) {
              <a [routerLink]="['/test', test.id]" class="search-item">
                <span class="si-name">{{ test.name }}</span>
                <span class="si-price">₹{{ test.discountedPrice }}</span>
              </a>
            }
          </div>
        }
      </div>
    </div>

    <div class="container">
      <!-- Banner / Offers -->
      <div class="banner-section">
        <div class="banner-scroll">
          @for (banner of banners; track banner.id) {
            <div class="banner-card" [style.background]="banner.gradient">
              <div class="banner-text">
                <div class="banner-tag">{{ banner.tag }}</div>
                <div class="banner-title">{{ banner.title }}</div>
                <div class="banner-sub">{{ banner.subtitle }}</div>
                <button class="banner-btn">Book Now →</button>
              </div>
              <div class="banner-emoji">{{ banner.emoji }}</div>
            </div>
          }
        </div>
        <!-- Dots -->
        <div class="banner-dots">
          @for (b of banners; track b.id; let i = $index) {
            <span class="dot" [class.active]="i === 0"></span>
          }
        </div>
      </div>

      <!-- Categories -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Browse Categories</h2>
        </div>
        <div class="categories-grid">
          @for (cat of data.categories; track cat.id) {
            <a [routerLink]="['/category', cat.id]" class="cat-card" [style.background]="cat.bgGradient">
              <div class="cat-emoji">{{ cat.emoji }}</div>
              <div class="cat-name">{{ cat.name }}</div>
              <div class="cat-count">{{ cat.testCount }} tests</div>
            </a>
          }
        </div>
      </section>

      <!-- Popular Tests -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">🔥 Popular Tests</h2>
          <a routerLink="/category/blood" class="section-link">See all</a>
        </div>
        <div class="scroll-x">
          @for (test of data.getPopularTests(); track test.id) {
            <div class="test-card">
              <div class="test-card-top">
                <span class="tc-cat">{{ test.category }}</span>
                @if (test.popular) { <span class="badge badge-danger">HOT</span> }
              </div>
              <div class="tc-name">{{ test.name }}</div>
              <div class="tc-lab">
                <lucide-icon name="hospital" [size]="12"></lucide-icon>
                {{ test.labName }}
              </div>
              <div class="tc-meta">
                @if (test.homeCollection) {
                  <span class="tc-tag home">🏠 Home</span>
                }
                @if (test.fastingRequired) {
                  <span class="tc-tag fasting">⏱ Fasting</span>
                }
              </div>
              <div class="tc-price-row">
                <div>
                  <div class="tc-price">₹{{ test.discountedPrice }}</div>
                  @if (test.discountPercent > 0) {
                    <div class="tc-original">₹{{ test.price }} <span class="tc-off">{{ test.discountPercent }}% off</span></div>
                  }
                </div>
                <button class="add-btn" (click)="addToCart(test, $event)"
                  [class.added]="data.isInCart(test.id)">
                  @if (data.isInCart(test.id)) {
                    <lucide-icon name="check" [size]="16"></lucide-icon>
                  } @else {
                    <lucide-icon name="plus" [size]="16"></lucide-icon>
                  }
                </button>
              </div>
              <a [routerLink]="['/test', test.id]" class="view-btn">View Details</a>
            </div>
          }
        </div>
      </section>

      <!-- Recommended Packages -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">⭐ Recommended Packages</h2>
        </div>
        <div class="packages-grid">
          @for (pkg of data.packages; track pkg.id) {
            <div class="pkg-card" [style.background]="pkg.gradient">
              <div class="pkg-top">
                <span class="pkg-emoji">{{ pkg.emoji }}</span>
                @if (pkg.popular) { <span class="pkg-popular">Popular</span> }
              </div>
              <div class="pkg-name">{{ pkg.name }}</div>
              <div class="pkg-desc">{{ pkg.description }}</div>
              <div class="pkg-count">{{ pkg.testCount }} Parameters</div>
              <div class="pkg-price-row">
                <div>
                  <div class="pkg-discounted">₹{{ pkg.discountedPrice }}</div>
                  <div class="pkg-original">₹{{ pkg.price }} · {{ pkg.discountPercent }}% off</div>
                </div>
                <button class="pkg-btn">Book</button>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Nearby Labs -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">📍 Nearby Labs</h2>
        </div>
        <div class="labs-list">
          @for (lab of data.nearbyLabs; track lab.id) {
            <div class="lab-card">
              <div class="lab-emoji">{{ lab.emoji }}</div>
              <div class="lab-info">
                <div class="lab-name">{{ lab.name }}</div>
                <div class="lab-address">
                  <lucide-icon name="map-pin" [size]="11"></lucide-icon>
                  {{ lab.address }} · {{ lab.distance }}
                </div>
                <div class="lab-meta">
                  <span class="lab-rating">⭐ {{ lab.rating }} ({{ lab.totalReviews | number }})</span>
                  <span class="lab-time">
                    <lucide-icon name="clock" [size]="11"></lucide-icon>
                    {{ lab.timings }}
                  </span>
                </div>
                <div class="lab-tags">
                  @for (s of lab.specialties; track s) {
                    <span class="lab-spec">{{ s }}</span>
                  }
                  @if (lab.homeCollection) { <span class="lab-spec home">🏠 Home Collection</span> }
                </div>
              </div>
              <button class="lab-select">Select</button>
            </div>
          }
        </div>
      </section>

      <!-- Safety Banner -->
      <section class="safety-section">
        <div class="safety-card">
          <div class="safety-grid">
            @for (item of safetyItems; track item.icon) {
              <div class="safety-item">
                <div class="safety-icon">{{ item.icon }}</div>
                <div class="safety-label">{{ item.label }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <div style="height:24px"></div>
    </div>

    <!-- Toast -->
    @if (showToast()) {
      <div class="cart-toast">
        <lucide-icon name="check-circle" [size]="18"></lucide-icon>
        Added to cart!
      </div>
    }
  </div>
  `,
  styles: [`
    /* Search */
    .search-section { background: linear-gradient(135deg,#0ea5e9,#0284c7); padding: 12px 0 20px; position: sticky; top: var(--header-height); z-index: 90; }
    .search-wrap { position: relative; display: flex; align-items: center; background: #fff; border-radius: var(--radius-full); padding: 0 16px; height: 48px; box-shadow: 0 4px 20px rgba(0,0,0,.15); }
    .search-icon { color: var(--text-muted); flex-shrink: 0; }
    .search-input { flex: 1; border: none; outline: none; font-size: 14px; padding: 0 12px; background: transparent; color: var(--text-primary); }
    .clear-btn { font-size: 14px; color: var(--text-muted); background: none; border: none; cursor: pointer; padding: 4px; }
    .search-results { background: #fff; border-radius: var(--radius-md); margin-top: 8px; box-shadow: var(--shadow-lg); overflow: hidden; }
    .search-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); text-decoration: none; }
    .search-item:hover { background: var(--surface-2); }
    .si-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
    .si-price { font-size: 13px; font-weight: 700; color: var(--primary); }
    /* Banner */
    .banner-section { padding: 16px 0; }
    .banner-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px; }
    .banner-scroll::-webkit-scrollbar { display: none; }
    .banner-card { min-width: 300px; border-radius: var(--radius-lg); padding: 20px; display: flex; align-items: center; justify-content: space-between; position: relative; overflow: hidden; }
    .banner-text { flex: 1; }
    .banner-tag { display: inline-block; background: rgba(255,255,255,.25); color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 99px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
    .banner-title { font-size: 18px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 4px; }
    .banner-sub { font-size: 12px; color: rgba(255,255,255,.85); margin-bottom: 12px; }
    .banner-btn { background: #fff; color: #0284c7; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 99px; border: none; cursor: pointer; }
    .banner-emoji { font-size: 56px; flex-shrink: 0; line-height: 1; }
    .banner-dots { display: flex; gap: 6px; justify-content: center; margin-top: 8px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); transition: var(--transition); }
    .dot.active { width: 18px; border-radius: 99px; background: var(--primary); }
    /* Categories Grid */
    .categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    @media (min-width: 480px) { .categories-grid { grid-template-columns: repeat(4, 1fr); } }
    @media (min-width: 768px) { .categories-grid { grid-template-columns: repeat(6, 1fr); } }
    @media (min-width: 1024px) { .categories-grid { grid-template-columns: repeat(6, 1fr); } }
    .cat-card {
      border-radius: var(--radius-md); padding: 14px 8px; text-align: center;
      cursor: pointer; text-decoration: none; transition: var(--transition);
      border: 1.5px solid rgba(0,0,0,.04); display: flex; flex-direction: column;
      align-items: center; gap: 6px;
    }
    .cat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .cat-emoji { font-size: 28px; line-height: 1; }
    .cat-name { font-size: 11px; font-weight: 700; color: var(--text-primary); text-align: center; line-height: 1.2; }
    .cat-count { font-size: 10px; color: var(--text-muted); }
    /* Test Cards */
    .test-card { width: 220px; background: #fff; border-radius: var(--radius-lg); padding: 16px; border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); transition: var(--transition); flex-shrink: 0; }
    .test-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .test-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .tc-cat { font-size: 10px; font-weight: 600; color: var(--primary); background: var(--primary-light); padding: 2px 8px; border-radius: 99px; }
    .tc-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; line-height: 1.3; }
    .tc-lab { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
    .tc-meta { display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap; }
    .tc-tag { font-size: 10px; padding: 3px 8px; border-radius: 99px; font-weight: 500; }
    .tc-tag.home { background: #d1fae5; color: #065f46; }
    .tc-tag.fasting { background: #fef3c7; color: #b45309; }
    .tc-price-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; }
    .tc-price { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .tc-original { font-size: 12px; color: var(--text-muted); }
    .tc-off { color: var(--secondary); font-weight: 700; font-size: 11px; }
    .add-btn { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--primary-dark)); color: #fff; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: var(--transition); box-shadow: var(--shadow-primary); }
    .add-btn.added { background: var(--secondary); }
    .add-btn:active { transform: scale(.9); }
    .view-btn { display: block; text-align: center; font-size: 13px; font-weight: 600; color: var(--primary); padding: 8px; border: 1.5px solid var(--primary); border-radius: var(--radius-sm); text-decoration: none; transition: var(--transition); }
    .view-btn:hover { background: var(--primary-light); }
    /* Packages */
    .packages-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (min-width: 768px) { .packages-grid { grid-template-columns: repeat(4, 1fr); } }
    .pkg-card { border-radius: var(--radius-lg); padding: 18px 16px; min-height: 180px; display: flex; flex-direction: column; gap: 6px; }
    .pkg-top { display: flex; align-items: center; justify-content: space-between; }
    .pkg-emoji { font-size: 28px; }
    .pkg-popular { font-size: 10px; font-weight: 700; background: rgba(255,255,255,.25); color: #fff; padding: 2px 10px; border-radius: 99px; }
    .pkg-name { font-size: 16px; font-weight: 700; color: #fff; line-height: 1.2; }
    .pkg-desc { font-size: 11px; color: rgba(255,255,255,.8); line-height: 1.4; }
    .pkg-count { font-size: 11px; color: rgba(255,255,255,.7); font-weight: 600; }
    .pkg-price-row { display: flex; align-items: flex-end; justify-content: space-between; margin-top: auto; }
    .pkg-discounted { font-size: 20px; font-weight: 800; color: #fff; }
    .pkg-original { font-size: 11px; color: rgba(255,255,255,.6); }
    .pkg-btn { background: rgba(255,255,255,.25); color: #fff; font-size: 12px; font-weight: 700; padding: 8px 16px; border-radius: 99px; border: 1px solid rgba(255,255,255,.4); cursor: pointer; backdrop-filter: blur(8px); }
    .pkg-btn:hover { background: rgba(255,255,255,.4); }
    /* Labs */
    .labs-list { display: flex; flex-direction: column; gap: 12px; }
    .lab-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; align-items: flex-start; gap: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
    .lab-emoji { font-size: 36px; flex-shrink: 0; line-height: 1; }
    .lab-info { flex: 1; }
    .lab-name { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 3px; }
    .lab-address { font-size: 12px; color: var(--text-muted); display: flex; align-items: center; gap: 4px; margin-bottom: 4px; }
    .lab-meta { display: flex; gap: 12px; font-size: 12px; color: var(--text-secondary); margin-bottom: 6px; flex-wrap: wrap; }
    .lab-rating { font-weight: 600; }
    .lab-time { display: flex; align-items: center; gap: 4px; }
    .lab-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .lab-spec { font-size: 10px; background: var(--surface-3); color: var(--text-secondary); padding: 2px 8px; border-radius: 99px; font-weight: 500; }
    .lab-spec.home { background: #d1fae5; color: #065f46; }
    .lab-select { flex-shrink: 0; font-size: 13px; font-weight: 600; color: var(--primary); border: 1.5px solid var(--primary); background: transparent; padding: 8px 14px; border-radius: var(--radius-sm); cursor: pointer; white-space: nowrap; transition: var(--transition); }
    .lab-select:hover { background: var(--primary-light); }
    /* Safety */
    .safety-card { background: linear-gradient(135deg,#0ea5e9,#10b981); border-radius: var(--radius-xl); padding: 20px; }
    .safety-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    @media (max-width: 480px) { .safety-grid { grid-template-columns: repeat(2, 1fr); } }
    .safety-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .safety-icon { font-size: 28px; }
    .safety-label { font-size: 11px; color: rgba(255,255,255,.9); font-weight: 600; text-align: center; }
    /* Toast */
    .cart-toast {
      position: fixed; bottom: calc(var(--bottom-nav-height) + 16px); left: 50%;
      transform: translateX(-50%);
      background: #0f172a; color: #fff; font-size: 14px; font-weight: 600;
      padding: 12px 20px; border-radius: 99px; display: flex; align-items: center; gap: 8px;
      z-index: 999; animation: slideUp 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,.3);
    }
    .cart-toast lucide-icon { color: var(--secondary); }
  `]
})
export class HomeComponent {
  data = inject(LabDataService);
  searchQuery = signal('');
  searchResults = signal<any[]>([]);
  showToast = signal(false);

  banners = [
    { id: 1, tag: 'Limited Offer', title: 'Full Body Checkup @ ₹999', subtitle: 'Save ₹2000 today! 72 parameters covered', emoji: '🩺', gradient: 'linear-gradient(135deg,#0ea5e9,#0284c7)' },
    { id: 2, tag: 'Home Collection', title: 'We Come To You', subtitle: 'Free home sample collection on orders above ₹500', emoji: '🏠', gradient: 'linear-gradient(135deg,#10b981,#059669)' },
    { id: 3, tag: 'New', title: 'Thyroid Package', subtitle: 'T3+T4+TSH+Antibodies only ₹419', emoji: '🦋', gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  ];

  safetyItems = [
    { icon: '🔬', label: 'NABL Certified' },
    { icon: '🏠', label: 'Home Collection' },
    { icon: '📄', label: 'Digital Reports' },
    { icon: '🔒', label: '100% Secure' },
  ];

  onSearch(query: string) {
    if (!query.trim()) { this.searchResults.set([]); return; }
    const q = query.toLowerCase();
    this.searchResults.set(
      this.data.tests.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)).slice(0, 6)
    );
  }

  addToCart(test: any, e: Event) {
    e.preventDefault();
    e.stopPropagation();
    this.data.addToCart(test);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2000);
  }
}
