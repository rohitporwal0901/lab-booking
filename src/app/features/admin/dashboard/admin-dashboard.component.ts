import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  <div class="admin-dash">
    <!-- Welcome -->
    <div class="welcome-bar">
      <div>
        <div class="wb-title">Good Morning, Admin! 👋</div>
        <div class="wb-sub">Here's what's happening today</div>
      </div>
      <div class="wb-date">{{ today }}</div>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      @for (kpi of kpis; track kpi.label) {
        <div class="kpi-card" [style.background]="kpi.gradient">
          <div class="kpi-top">
            <div class="kpi-emoji">{{ kpi.emoji }}</div>
            <div class="kpi-trend" [class.up]="kpi.trendUp">
              {{ kpi.trendUp ? '↑' : '↓' }} {{ kpi.trend }}
            </div>
          </div>
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-label">{{ kpi.label }}</div>
        </div>
      }
    </div>

    <!-- Recent Orders + Status Distribution -->
    <div class="two-col">
      <div class="dash-card">
        <div class="dc-header">
          <h3 class="dc-title">Recent Orders</h3>
          <a routerLink="/admin/orders" class="dc-link">View All</a>
        </div>
        <div class="recent-orders">
          @for (order of data.mockOrders; track order.id) {
            <div class="ro-row">
              <div class="ro-left">
                <div class="ro-id">{{ order.id }}</div>
                <div class="ro-user">{{ order.userName }}</div>
                <div class="ro-date">{{ order.appointmentDate }}</div>
              </div>
              <div class="ro-right">
                <div class="ro-amount">₹{{ order.totalAmount }}</div>
                <span class="status-pill status-{{ order.status }}">{{ statusShort(order.status) }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="dash-card">
        <div class="dc-header">
          <h3 class="dc-title">Order Status</h3>
        </div>
        <div class="status-bars">
          @for (s of statusBreakdown; track s.label) {
            <div class="sb-row">
              <div class="sb-label">{{ s.emoji }} {{ s.label }}</div>
              <div class="sb-bar-wrap">
                <div class="sb-bar" [style.width.%]="s.pct" [style.background]="s.color"></div>
              </div>
              <div class="sb-val">{{ s.count }}</div>
            </div>
          }
        </div>
        <!-- Revenue Chart Placeholder -->
        <div class="dc-header" style="margin-top:20px">
          <h3 class="dc-title">Quick Actions</h3>
        </div>
        <div class="quick-actions">
          <a routerLink="/admin/tests" class="qa-btn primary">+ Add New Test</a>
          <a routerLink="/admin/orders" class="qa-btn secondary">View Orders</a>
          <a routerLink="/admin/reports" class="qa-btn green">Upload Reports</a>
        </div>
      </div>
    </div>

    <!-- Top Tests -->
    <div class="dash-card">
      <div class="dc-header">
        <h3 class="dc-title">🔥 Top Performing Tests</h3>
        <a routerLink="/admin/tests" class="dc-link">Manage</a>
      </div>
      <div class="top-tests">
        @for (test of data.getPopularTests().slice(0,5); track test.id) {
          <div class="tt-row">
            <div class="tt-rank">{{ $index + 1 }}</div>
            <div class="tt-info">
              <div class="tt-name">{{ test.name }}</div>
              <div class="tt-cat">{{ test.category }}</div>
            </div>
            <div class="tt-right">
              <div class="tt-price">₹{{ test.discountedPrice }}</div>
              <div class="tt-rating">⭐ {{ test.rating }}</div>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
  `,
  styles: [`
    .admin-dash { display: flex; flex-direction: column; gap: 20px; }
    .welcome-bar { display: flex; align-items: center; justify-content: space-between; background: linear-gradient(135deg,#0f172a,#1e3a5f); border-radius: var(--radius-xl); padding: 20px 24px; }
    .wb-title { font-size: 20px; font-weight: 800; color: #fff; }
    .wb-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
    .wb-date { font-size: 13px; font-weight: 600; color: #64748b; }
    /* KPI Cards */
    .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    @media (min-width: 768px) { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }
    .kpi-card { border-radius: var(--radius-xl); padding: 18px 16px; }
    .kpi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .kpi-emoji { font-size: 28px; }
    .kpi-trend { font-size: 12px; font-weight: 700; color: rgba(255,255,255,.8); }
    .kpi-value { font-size: 28px; font-weight: 900; color: #fff; }
    .kpi-label { font-size: 12px; color: rgba(255,255,255,.8); font-weight: 500; margin-top: 2px; }
    /* Two Col */
    .two-col { display: grid; grid-template-columns: 1fr; gap: 16px; }
    @media (min-width: 768px) { .two-col { grid-template-columns: 1fr 1fr; } }
    /* Dash Card */
    .dash-card { background: #fff; border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
    .dc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .dc-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .dc-link { font-size: 13px; font-weight: 600; color: var(--primary); text-decoration: none; }
    /* Recent Orders */
    .recent-orders { display: flex; flex-direction: column; gap: 12px; }
    .ro-row { display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--surface-2); border-radius: var(--radius-md); }
    .ro-left { display: flex; flex-direction: column; gap: 2px; }
    .ro-id { font-size: 12px; font-weight: 800; color: var(--text-primary); }
    .ro-user { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
    .ro-date { font-size: 11px; color: var(--text-muted); }
    .ro-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .ro-amount { font-size: 14px; font-weight: 800; color: var(--text-primary); }
    /* Status Bars */
    .status-bars { display: flex; flex-direction: column; gap: 10px; }
    .sb-row { display: flex; align-items: center; gap: 10px; }
    .sb-label { font-size: 12px; color: var(--text-secondary); width: 130px; flex-shrink: 0; }
    .sb-bar-wrap { flex: 1; height: 8px; background: var(--surface-3); border-radius: 99px; overflow: hidden; }
    .sb-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
    .sb-val { font-size: 12px; font-weight: 700; color: var(--text-primary); width: 24px; text-align: right; }
    /* Quick Actions */
    .quick-actions { display: flex; flex-direction: column; gap: 8px; }
    .qa-btn { display: block; text-align: center; padding: 12px; border-radius: var(--radius-md); font-size: 14px; font-weight: 700; text-decoration: none; }
    .qa-btn.primary { background: var(--primary-light); color: var(--primary-dark); }
    .qa-btn.secondary { background: var(--surface-3); color: var(--text-secondary); }
    .qa-btn.green { background: var(--secondary-light); color: var(--secondary-dark); }
    /* Top Tests */
    .top-tests { display: flex; flex-direction: column; gap: 12px; }
    .tt-row { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--surface-2); border-radius: var(--radius-md); }
    .tt-rank { width: 28px; height: 28px; border-radius: 50%; background: var(--primary-light); color: var(--primary-dark); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; flex-shrink: 0; }
    .tt-info { flex: 1; }
    .tt-name { font-size: 13px; font-weight: 700; color: var(--text-primary); }
    .tt-cat { font-size: 11px; color: var(--text-muted); }
    .tt-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
    .tt-price { font-size: 14px; font-weight: 800; color: var(--text-primary); }
    .tt-rating { font-size: 11px; color: var(--text-muted); }
    /* Status Pills */
    .status-pill.status-pending { background: #fef3c7; color: #b45309; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
    .status-pill.status-sample_collected { background: #dbeafe; color: #1d4ed8; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
    .status-pill.status-processing { background: #ede9fe; color: #6d28d9; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
    .status-pill.status-completed { background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
  `]
})
export class AdminDashboardComponent {
  data = inject(LabDataService);
  today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  kpis = [
    { emoji: '📦', label: 'Total Bookings', value: '1,248', trend: '12%', trendUp: true, gradient: 'linear-gradient(135deg,#667eea,#764ba2)' },
    { emoji: '💰', label: 'Revenue (Month)', value: '₹4.2L', trend: '8%', trendUp: true, gradient: 'linear-gradient(135deg,#f6d365,#fda085)' },
    { emoji: '⏳', label: 'Pending Tests', value: '43', trend: '5%', trendUp: false, gradient: 'linear-gradient(135deg,#fbc2eb,#a18cd1)' },
    { emoji: '✅', label: 'Completed Today', value: '89', trend: '15%', trendUp: true, gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)' },
  ];

  statusBreakdown = [
    { emoji: '⏳', label: 'Pending', count: 43, pct: 35, color: '#f59e0b' },
    { emoji: '🩸', label: 'Sample Collected', count: 28, pct: 22, color: '#3b82f6' },
    { emoji: '🔬', label: 'Processing', count: 18, pct: 14, color: '#8b5cf6' },
    { emoji: '✅', label: 'Completed', count: 89, pct: 70, color: '#10b981' },
  ];

  statusShort(s: string) {
    const m: Record<string, string> = { pending: 'Pending', sample_collected: 'Collected', processing: 'Processing', completed: 'Done' };
    return m[s] || s;
  }
}
