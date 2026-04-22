import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../core/services/lab-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  template: `
    <!-- Header -->
    <header class="user-header">
      <div class="header-inner container">
        <div class="brand">
          <span class="brand-icon">🔬</span>
          <div>
            <div class="brand-name">LabBook</div>
            <div class="brand-sub">Quick · Accurate · Reliable</div>
          </div>
        </div>
        <div class="header-actions">
          <button class="icon-btn" routerLink="/dashboard">
            <lucide-icon name="bell" [size]="22"></lucide-icon>
          </button>
          <button class="cart-btn" routerLink="/cart">
            <lucide-icon name="shopping-cart" [size]="22"></lucide-icon>
            @if (cartCount() > 0) {
              <span class="cart-badge">{{ cartCount() }}</span>
            }
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-outlet />
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-item">
        <lucide-icon name="home" [size]="22"></lucide-icon>
        <span>Home</span>
      </a>
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
        <lucide-icon name="file-text" [size]="22"></lucide-icon>
        <span>Orders</span>
      </a>
      <a routerLink="/cart" class="nav-item cart-nav">
        <div class="cart-nav-inner">
          <lucide-icon name="shopping-cart" [size]="24"></lucide-icon>
          @if (cartCount() > 0) {
            <span class="cart-badge-nav">{{ cartCount() }}</span>
          }
        </div>
        <span>Cart</span>
      </a>
      <a routerLink="/admin/dashboard" class="nav-item">
        <lucide-icon name="layout-dashboard" [size]="22"></lucide-icon>
        <span>Admin</span>
      </a>
      <a routerLink="/profile" routerLinkActive="active" class="nav-item">
        <lucide-icon name="user" [size]="22"></lucide-icon>
        <span>Profile</span>
      </a>
    </nav>
  `,
  styles: [`
    .user-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: var(--header-height);
      background: #fff;
      border-bottom: 1px solid var(--border-light);
      box-shadow: 0 2px 12px rgba(0,0,0,.06);
    }
    .header-inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-icon { font-size: 28px; line-height: 1; }
    .brand-name { font-size: 20px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
    .brand-sub { font-size: 10px; color: var(--text-muted); font-weight: 500; margin-top: 1px; }
    .header-actions { display: flex; align-items: center; gap: 8px; }
    .icon-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); transition: var(--transition); }
    .icon-btn:hover { background: var(--primary-light); color: var(--primary); }
    .cart-btn { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); display: flex; align-items: center; justify-content: center; color: #fff; position: relative; box-shadow: var(--shadow-primary); }
    .cart-badge { position: absolute; top: -4px; right: -4px; background: var(--danger); color: #fff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }
    .main-content { padding-top: var(--header-height); padding-bottom: calc(var(--bottom-nav-height) + 8px); min-height: 100vh; }
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
      height: var(--bottom-nav-height);
      background: #fff;
      border-top: 1px solid var(--border-light);
      display: flex;
      align-items: center;
      box-shadow: 0 -4px 20px rgba(0,0,0,.08);
    }
    .nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: var(--text-muted);
      font-size: 10px;
      font-weight: 500;
      transition: var(--transition);
      padding: 8px 4px;
      text-decoration: none;
    }
    .nav-item.active, .nav-item:hover { color: var(--primary); }
    .nav-item.active lucide-icon { filter: drop-shadow(0 0 6px rgba(14,165,233,.4)); }
    .cart-nav { position: relative; }
    .cart-nav-inner { position: relative; }
    .cart-badge-nav { position: absolute; top: -6px; right: -8px; background: var(--danger); color: #fff; font-size: 10px; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  `]
})
export class UserLayoutComponent {
  private data = inject(LabDataService);
  cartCount = this.data.cartCount;
}
