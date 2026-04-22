import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <div class="admin-shell">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <span class="brand-icon">🔬</span>
          <div>
            <div class="brand-name">LabBook</div>
            <div class="brand-tag">Admin Panel</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
            <lucide-icon name="layout-dashboard" [size]="20"></lucide-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/admin/tests" routerLinkActive="active" class="nav-link">
            <lucide-icon name="flask-conical" [size]="20"></lucide-icon>
            <span>Manage Tests</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-link">
            <lucide-icon name="clipboard-list" [size]="20"></lucide-icon>
            <span>Orders</span>
          </a>
          <a routerLink="/admin/reports" routerLinkActive="active" class="nav-link">
            <lucide-icon name="upload" [size]="20"></lucide-icon>
            <span>Upload Reports</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
            <lucide-icon name="users" [size]="20"></lucide-icon>
            <span>Users</span>
          </a>
          <a routerLink="/admin/analytics" routerLinkActive="active" class="nav-link">
            <lucide-icon name="trending-up" [size]="20"></lucide-icon>
            <span>Analytics</span>
          </a>
          <div class="nav-divider"></div>
          <a routerLink="/" class="nav-link">
            <lucide-icon name="home" [size]="20"></lucide-icon>
            <span>User View</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="admin-user">
            <div class="avatar">A</div>
            <div>
              <div class="admin-name">Lab Admin</div>
              <div class="admin-role">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="admin-main">
        <!-- Top Bar -->
        <header class="admin-topbar">
          <h2 class="page-title">Admin Panel</h2>
          <div class="topbar-right">
            <button class="topbar-btn">
              <lucide-icon name="bell" [size]="20"></lucide-icon>
            </button>
            <div class="admin-avatar-sm">A</div>
          </div>
        </header>
        <div class="admin-content">
          <router-outlet />
        </div>
      </div>
    </div>

    <!-- Mobile Bottom Nav (Admin) -->
    <nav class="admin-mobile-nav">
      <a routerLink="/admin/dashboard" routerLinkActive="active" class="navitem">
        <lucide-icon name="layout-dashboard" [size]="20"></lucide-icon>
        <span>Dash</span>
      </a>
      <a routerLink="/admin/orders" routerLinkActive="active" class="navitem">
        <lucide-icon name="clipboard-list" [size]="20"></lucide-icon>
        <span>Orders</span>
      </a>
      <a routerLink="/admin/tests" routerLinkActive="active" class="navitem">
        <lucide-icon name="flask-conical" [size]="20"></lucide-icon>
        <span>Tests</span>
      </a>
      <a routerLink="/admin/reports" routerLinkActive="active" class="navitem">
        <lucide-icon name="upload" [size]="20"></lucide-icon>
        <span>Reports</span>
      </a>
      <a routerLink="/admin/analytics" routerLinkActive="active" class="navitem">
        <lucide-icon name="trending-up" [size]="20"></lucide-icon>
        <span>Analytics</span>
      </a>
    </nav>
  `,
  styles: [`
    .admin-shell { display: flex; min-height: 100vh; }
    /* Sidebar */
    .admin-sidebar {
      width: 240px;
      background: #0f172a;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 50;
      overflow-y: auto;
    }
    @media (max-width: 1023px) { .admin-sidebar { display: none; } }
    .sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,.08); }
    .brand-icon { font-size: 32px; }
    .brand-name { font-size: 18px; font-weight: 800; color: #fff; }
    .brand-tag { font-size: 10px; color: #94a3b8; font-weight: 500; background: rgba(14,165,233,.2); color: var(--primary); padding: 2px 8px; border-radius: 99px; display: inline-block; margin-top: 2px; }
    .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .nav-link {
      display: flex; align-items: center; gap: 12px;
      padding: 11px 14px; border-radius: 10px;
      color: #94a3b8; font-size: 14px; font-weight: 500;
      transition: all 0.2s; text-decoration: none;
    }
    .nav-link:hover { background: rgba(255,255,255,.06); color: #e2e8f0; }
    .nav-link.active { background: linear-gradient(135deg, rgba(14,165,233,.2), rgba(16,185,129,.15)); color: #fff; font-weight: 600; }
    .nav-link.active lucide-icon { color: var(--primary); }
    .nav-divider { height: 1px; background: rgba(255,255,255,.06); margin: 8px 0; }
    .sidebar-footer { padding: 16px 20px; border-top: 1px solid rgba(255,255,255,.06); }
    .admin-user { display: flex; align-items: center; gap: 10px; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }
    .admin-name { font-size: 13px; color: #e2e8f0; font-weight: 600; }
    .admin-role { font-size: 11px; color: #64748b; }
    /* Main */
    .admin-main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
    @media (max-width: 1023px) { .admin-main { margin-left: 0; padding-bottom: 70px; } }
    .admin-topbar {
      position: sticky; top: 0; z-index: 40;
      background: #fff; border-bottom: 1px solid var(--border-light);
      height: 60px; display: flex; align-items: center;
      justify-content: space-between; padding: 0 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,.04);
    }
    .page-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .topbar-btn { width: 36px; height: 36px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
    .admin-avatar-sm { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }
    .admin-content { flex: 1; padding: 24px; background: var(--surface-2); }
    @media (max-width: 768px) { .admin-content { padding: 16px; } }
    /* Mobile Nav */
    .admin-mobile-nav {
      display: none;
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
      height: 64px; background: #0f172a;
      border-top: 1px solid rgba(255,255,255,.1);
    }
    @media (max-width: 1023px) { .admin-mobile-nav { display: flex; } }
    .navitem {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 3px; color: #64748b;
      font-size: 10px; font-weight: 500; text-decoration: none; transition: var(--transition);
    }
    .navitem.active, .navitem:hover { color: var(--primary); }
  `]
})
export class AdminLayoutComponent {}
