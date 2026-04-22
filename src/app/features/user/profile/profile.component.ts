import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <div class="container">
        <div class="ph-avatar">RS</div>
        <div class="ph-name">Rahul Sharma</div>
        <div class="ph-email">rahul.sharma&#64;email.com</div>
        <div class="ph-phone">+91 98765 43210</div>
        <button class="edit-btn">✏️ Edit Profile</button>
      </div>
    </div>

    <div class="container">
      <!-- Menu Items -->
      <div class="menu-section">
        <div class="menu-label">Account</div>
        @for (item of menuItems; track item.label) {
          <a [routerLink]="item.route" class="menu-item">
            <span class="mi-icon">{{ item.icon }}</span>
            <span class="mi-label">{{ item.label }}</span>
            <lucide-icon name="chevron-right" [size]="18" class="mi-arrow"></lucide-icon>
          </a>
        }
      </div>

      <div class="menu-section">
        <div class="menu-label">Lab Admin</div>
        <a routerLink="/admin/dashboard" class="menu-item admin-link">
          <span class="mi-icon">🛠️</span>
          <span class="mi-label">Switch to Admin Panel</span>
          <lucide-icon name="chevron-right" [size]="18" class="mi-arrow"></lucide-icon>
        </a>
      </div>

      <div class="menu-section">
        <div class="menu-label">Support</div>
        @for (item of supportItems; track item.label) {
          <div class="menu-item">
            <span class="mi-icon">{{ item.icon }}</span>
            <span class="mi-label">{{ item.label }}</span>
            <lucide-icon name="chevron-right" [size]="18" class="mi-arrow"></lucide-icon>
          </div>
        }
      </div>

      <button class="logout-btn">
        <lucide-icon name="log-out" [size]="18"></lucide-icon>
        Logout
      </button>

      <div style="height:32px"></div>
    </div>
  </div>
  `,
  styles: [`
    .profile-page { min-height: 100vh; background: var(--surface-2); }
    .profile-header { background: linear-gradient(135deg,#0ea5e9,#0284c7); padding: 24px 0 32px; text-align: center; }
    .ph-avatar { width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,.25); margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #fff; border: 3px solid rgba(255,255,255,.5); }
    .ph-name { font-size: 22px; font-weight: 800; color: #fff; }
    .ph-email { font-size: 13px; color: rgba(255,255,255,.8); margin: 4px 0 2px; }
    .ph-phone { font-size: 13px; color: rgba(255,255,255,.8); }
    .edit-btn { margin-top: 14px; background: rgba(255,255,255,.2); color: #fff; padding: 8px 20px; border-radius: 99px; border: 1px solid rgba(255,255,255,.4); font-size: 13px; font-weight: 600; cursor: pointer; backdrop-filter: blur(8px); }
    /* Menu */
    .menu-section { margin: 16px 0; }
    .menu-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); padding: 0 4px 8px; }
    .menu-item { display: flex; align-items: center; gap: 12px; background: #fff; padding: 16px; border-radius: var(--radius-lg); margin-bottom: 8px; text-decoration: none; transition: var(--transition); cursor: pointer; }
    .menu-item:hover { background: var(--surface-3); }
    .admin-link { border: 2px solid var(--primary); background: var(--primary-light); }
    .mi-icon { font-size: 22px; width: 32px; text-align: center; }
    .mi-label { flex: 1; font-size: 14px; font-weight: 600; color: var(--text-primary); }
    .mi-arrow { color: var(--text-muted); }
    .logout-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 16px; background: #fee2e2; color: var(--danger); border-radius: var(--radius-lg); border: none; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px; }
  `]
})
export class ProfileComponent {
  menuItems = [
    { icon: '📦', label: 'My Orders', route: '/dashboard' },
    { icon: '📄', label: 'My Reports', route: '/dashboard' },
    { icon: '👨‍👩‍👧', label: 'Family Members', route: '/dashboard' },
    { icon: '🏠', label: 'Saved Addresses', route: '/profile' },
    { icon: '💳', label: 'Payment Methods', route: '/profile' },
  ];
  supportItems = [
    { icon: '❓', label: 'Help & FAQ', route: '/help' },
    { icon: '📞', label: 'Contact Support', route: '/contact' },
    { icon: '⭐', label: 'Rate the App', route: '/rate' },
  ];
}
