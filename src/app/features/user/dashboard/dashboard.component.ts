import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
  <div class="dashboard-page">
    <div class="dash-header">
      <div class="container">
        <!-- Greeting -->
        <div class="greeting-row">
          <div>
            <div class="greeting">👋 Hello, Rahul!</div>
            <div class="greeting-sub">Track your tests & download reports</div>
          </div>
          <a routerLink="/profile" class="profile-avatar">RS</a>
        </div>
        <!-- Quick Stats -->
        <div class="stats-row">
          <div class="stat-pill">
            <span class="stat-num">{{ data.mockOrders.length }}</span>
            <span class="stat-label">Total Orders</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">1</span>
            <span class="stat-label">Reports Ready</span>
          </div>
          <div class="stat-pill">
            <span class="stat-num">2</span>
            <span class="stat-label">In Progress</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Tab Bar -->
      <div class="tab-bar">
        @for (tab of tabs; track tab.id) {
          <button class="tab" [class.active]="activeTab() === tab.id"
            (click)="activeTab.set(tab.id)">
            {{ tab.label }}
          </button>
        }
      </div>

      <!-- All Orders -->
      @if (activeTab() === 'orders') {
        <div class="orders-list">
          @for (order of data.mockOrders; track order.id) {
            <div class="order-card">
              <div class="oc-header">
                <div>
                  <div class="oc-id">{{ order.id }}</div>
                  <div class="oc-date">📅 {{ order.appointmentDate }} · {{ order.appointmentSlot }}</div>
                </div>
                <span class="status-pill status-{{ order.status }}">
                  {{ statusLabel(order.status) }}
                </span>
              </div>
              <div class="divider"></div>
              @for (item of order.items; track item.testId) {
                <div class="oc-item">
                  <lucide-icon name="flask-conical" [size]="14" style="color:var(--primary)"></lucide-icon>
                  <span class="oci-name">{{ item.testName }}</span>
                  <span class="oci-lab">{{ item.labName }}</span>
                </div>
              }
              <div class="divider"></div>
              <div class="oc-footer">
                <div class="oc-amount">₹{{ order.totalAmount }}</div>
                <div class="oc-actions">
                  @if (order.status === 'completed' && order.reportUrl) {
                    <button class="oc-btn success">
                      <lucide-icon name="download" [size]="14"></lucide-icon>
                      Download Report
                    </button>
                  }
                  <button class="oc-btn outline" (click)="bookAgain(order)">
                    <lucide-icon name="refresh-cw" [size]="14"></lucide-icon>
                    Book Again
                  </button>
                </div>
              </div>
              @if (order.technicianName) {
                <div class="tech-row">
                  <lucide-icon name="user-check" [size]="13"></lucide-icon>
                  Assigned to: <strong>{{ order.technicianName }}</strong>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Reports -->
      @if (activeTab() === 'reports') {
        <div class="reports-list">
          @for (order of completedOrders(); track order.id) {
            <div class="report-card">
              <div class="rc-icon">📄</div>
              <div class="rc-info">
                <div class="rc-tests">{{ getTestNames(order) }}</div>
                <div class="rc-date">{{ order.updatedAt }}</div>
              </div>
              <button class="rc-download">
                <lucide-icon name="download" [size]="18"></lucide-icon>
              </button>
            </div>
          }
          @if (completedOrders().length === 0) {
            <div class="empty-state">
              <div class="emoji">📋</div>
              <h3>No reports yet</h3>
              <p>Completed test reports will appear here.</p>
            </div>
          }
        </div>
      }

      <!-- Family -->
      @if (activeTab() === 'family') {
        <div class="family-section">
          @for (member of familyMembers; track member.name) {
            <div class="member-card">
              <div class="mem-avatar">{{ member.initials }}</div>
              <div class="mem-info">
                <div class="mem-name">{{ member.name }}</div>
                <div class="mem-rel">{{ member.relation }} · {{ member.age }} yrs</div>
              </div>
              <button class="mem-btn">Book Test</button>
            </div>
          }
          <button class="add-member-btn">
            <lucide-icon name="user-plus" [size]="18"></lucide-icon>
            Add Family Member
          </button>
        </div>
      }

      <div style="height:24px"></div>
    </div>
  </div>
  `,
  styles: [`
    .dashboard-page { min-height: 100vh; background: var(--surface-2); }
    .dash-header { background: linear-gradient(135deg,#0ea5e9,#10b981); padding: 20px 0 28px; }
    .greeting-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .greeting { font-size: 22px; font-weight: 800; color: #fff; }
    .greeting-sub { font-size: 13px; color: rgba(255,255,255,.8); }
    .profile-avatar { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.25); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 700; text-decoration: none; backdrop-filter: blur(8px); border: 2px solid rgba(255,255,255,.4); }
    .stats-row { display: flex; gap: 10px; }
    .stat-pill { flex: 1; background: rgba(255,255,255,.2); border-radius: var(--radius-lg); padding: 14px 10px; text-align: center; backdrop-filter: blur(8px); }
    .stat-num { display: block; font-size: 24px; font-weight: 900; color: #fff; }
    .stat-label { font-size: 11px; color: rgba(255,255,255,.8); font-weight: 500; }
    /* Tabs */
    .tab-bar { display: flex; gap: 8px; padding: 16px 0 4px; overflow-x: auto; }
    .tab-bar::-webkit-scrollbar { display: none; }
    .tab { padding: 9px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface-3); border: none; cursor: pointer; transition: var(--transition); white-space: nowrap; }
    .tab.active { background: var(--primary); color: #fff; box-shadow: var(--shadow-primary); }
    /* Orders */
    .orders-list { display: flex; flex-direction: column; gap: 12px; padding: 12px 0; }
    .order-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
    .oc-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
    .oc-id { font-size: 13px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
    .oc-date { font-size: 12px; color: var(--text-muted); }
    .oc-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; }
    .oci-name { font-size: 13px; font-weight: 600; color: var(--text-primary); flex: 1; }
    .oci-lab { font-size: 11px; color: var(--text-muted); }
    .oc-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
    .oc-amount { font-size: 18px; font-weight: 900; color: var(--text-primary); }
    .oc-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .oc-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; cursor: pointer; border: none; transition: var(--transition); }
    .oc-btn.success { background: var(--secondary-light); color: var(--secondary-dark); }
    .oc-btn.outline { background: transparent; color: var(--primary); border: 1.5px solid var(--primary); }
    .tech-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-light); }
    /* Status Pills */
    .status-pill.status-pending { background: #fef3c7; color: #b45309; }
    .status-pill.status-sample_collected { background: #dbeafe; color: #1d4ed8; }
    .status-pill.status-processing { background: #ede9fe; color: #6d28d9; }
    .status-pill.status-completed { background: #d1fae5; color: #065f46; }
    .status-pill.status-cancelled { background: #fee2e2; color: #991b1b; }
    /* Reports */
    .reports-list { display: flex; flex-direction: column; gap: 10px; padding: 12px 0; }
    .report-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: var(--shadow-sm); }
    .rc-icon { font-size: 32px; flex-shrink: 0; }
    .rc-info { flex: 1; }
    .rc-id { font-size: 13px; font-weight: 800; color: var(--text-primary); margin-bottom: 2px; }
    .rc-tests { font-size: 12px; color: var(--text-secondary); margin-bottom: 2px; }
    .rc-date { font-size: 11px; color: var(--text-muted); }
    .rc-download { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    /* Family */
    .family-section { display: flex; flex-direction: column; gap: 10px; padding: 12px 0; }
    .member-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: var(--shadow-sm); }
    .mem-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg,var(--primary),var(--secondary)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 16px; font-weight: 700; }
    .mem-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .mem-rel { font-size: 12px; color: var(--text-muted); }
    .mem-btn { margin-left: auto; font-size: 12px; font-weight: 700; color: var(--primary); border: 1.5px solid var(--primary); background: transparent; padding: 8px 16px; border-radius: var(--radius-sm); cursor: pointer; }
    .add-member-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; background: var(--primary-light); border: 2px dashed var(--primary); border-radius: var(--radius-lg); font-size: 14px; font-weight: 700; color: var(--primary); cursor: pointer; }
  `]
})
export class UserDashboardComponent {
  data = inject(LabDataService);
  activeTab = signal('orders');

  tabs = [
    { id: 'orders', label: '📦 My Orders' },
    { id: 'reports', label: '📄 Reports' },
    { id: 'family', label: '👨‍👩‍👧 Family' },
  ];

  familyMembers = [
    { name: 'Rahul Sharma', relation: 'Self', age: 34, initials: 'RS' },
    { name: 'Priya Sharma', relation: 'Wife', age: 31, initials: 'PS' },
    { name: 'Om Sharma', relation: 'Son', age: 8, initials: 'OS' },
  ];

  completedOrders() {
    return this.data.mockOrders.filter(o => o.status === 'completed');
  }

  getTestNames(order: any): string {
    return order.items.map((i: any) => i.testName).join(' · ');
  }

  statusLabel(status: string) {
    const map: Record<string, string> = {
      pending: '⏳ Pending',
      sample_collected: '🩸 Sample Collected',
      processing: '🔬 Processing',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
    };
    return map[status] || status;
  }

  bookAgain(order: any) { }
}
