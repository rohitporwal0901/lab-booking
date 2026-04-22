import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
  <div class="admin-users">
    <div class="au-header">
      <h2 class="au-title">Users Management</h2>
      <div class="au-sub">{{ users.length }} registered users</div>
    </div>
    <!-- Search -->
    <div class="search-box">
      <lucide-icon name="search" [size]="16"></lucide-icon>
      <input type="text" placeholder="Search users…" class="search-input" />
    </div>
    <!-- Users Grid -->
    <div class="users-grid">
      @for (user of users; track user.id) {
        <div class="user-card">
          <div class="uc-avatar">{{ user.initials }}</div>
          <div class="uc-info">
            <div class="uc-name">{{ user.name }}</div>
            <div class="uc-contact">📧 {{ user.email }}</div>
            <div class="uc-contact">📱 {{ user.phone }}</div>
          </div>
          <div class="uc-stats">
            <div class="ucs-item">
              <div class="ucs-val">{{ user.orders }}</div>
              <div class="ucs-key">Orders</div>
            </div>
            <div class="ucs-item">
              <div class="ucs-val">₹{{ user.spent }}</div>
              <div class="ucs-key">Spent</div>
            </div>
          </div>
          <div class="uc-footer">
            <span class="uc-joined">Joined {{ user.joined }}</span>
            <span class="uc-status" [class.active]="user.active">{{ user.active ? '🟢 Active' : '🔴 Inactive' }}</span>
          </div>
          <div class="uc-actions">
            <button class="uca-btn">
              <lucide-icon name="eye" [size]="14"></lucide-icon>
              View Orders
            </button>
            <button class="uca-btn outline">
              <lucide-icon name="phone" [size]="14"></lucide-icon>
              Contact
            </button>
          </div>
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .admin-users { display: flex; flex-direction: column; gap: 16px; }
    .au-header {}
    .au-title { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .au-sub { font-size: 13px; color: var(--text-muted); }
    .search-box { display: flex; align-items: center; gap: 8px; background: #fff; border-radius: var(--radius-lg); padding: 12px 16px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
    .search-box lucide-icon { color: var(--text-muted); }
    .search-input { flex: 1; border: none; outline: none; font-size: 14px; color: var(--text-primary); background: transparent; }
    .users-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    @media (min-width: 640px) { .users-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .users-grid { grid-template-columns: repeat(3, 1fr); } }
    .user-card { background: #fff; border-radius: var(--radius-xl); padding: 18px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 12px; }
    .uc-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; font-weight: 800; }
    .uc-name { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .uc-contact { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
    .uc-stats { display: flex; gap: 20px; background: var(--surface-2); border-radius: var(--radius-md); padding: 12px 16px; }
    .ucs-item { text-align: center; }
    .ucs-val { font-size: 18px; font-weight: 800; color: var(--text-primary); }
    .ucs-key { font-size: 11px; color: var(--text-muted); }
    .uc-footer { display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
    .uc-joined { color: var(--text-muted); }
    .uc-status { font-size: 12px; font-weight: 600; color: var(--danger); }
    .uc-status.active { color: var(--secondary); }
    .uc-actions { display: flex; gap: 8px; }
    .uca-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 9px; border-radius: var(--radius-md); font-size: 12px; font-weight: 700; cursor: pointer; border: none; background: var(--primary-light); color: var(--primary-dark); }
    .uca-btn.outline { background: transparent; border: 1.5px solid var(--border); color: var(--text-secondary); }
  `]
})
export class AdminUsersComponent {
  users = [
    { id: 'u1', name: 'Rahul Sharma', email: 'rahul@email.com', phone: '+91 98765 43210', orders: 3, spent: '2,841', joined: 'Jan 2025', active: true, initials: 'RS' },
    { id: 'u2', name: 'Priya Singh', email: 'priya@email.com', phone: '+91 87654 32109', orders: 7, spent: '8,219', joined: 'Feb 2025', active: true, initials: 'PS' },
    { id: 'u3', name: 'Amit Verma', email: 'amit@email.com', phone: '+91 76543 21098', orders: 2, spent: '1,598', joined: 'Mar 2025', active: false, initials: 'AV' },
    { id: 'u4', name: 'Sunita Yadav', email: 'sunita@email.com', phone: '+91 65432 10987', orders: 5, spent: '5,345', joined: 'Mar 2025', active: true, initials: 'SY' },
    { id: 'u5', name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 54321 09876', orders: 1, spent: '629', joined: 'Apr 2025', active: true, initials: 'RK' },
    { id: 'u6', name: 'Anita Sharma', email: 'anita@email.com', phone: '+91 43210 98765', orders: 4, spent: '3,992', joined: 'Apr 2025', active: true, initials: 'AS' },
  ];
}
