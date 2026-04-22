import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';
import { LabOrder } from '../../../core/models/lab-test.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
  <div class="admin-orders">
    <div class="ao-header">
      <div>
        <h2 class="ao-title">Orders Management</h2>
        <div class="ao-sub">{{ orders().length }} orders found</div>
      </div>
    </div>

    <!-- Status Filter Tabs -->
    <div class="status-tabs">
      @for (tab of statusTabs; track tab.id) {
        <button class="stab" [class.active]="activeStatus() === tab.id"
          (click)="activeStatus.set(tab.id)">
          {{ tab.emoji }} {{ tab.label }}
          <span class="stab-count">{{ countByStatus(tab.id) }}</span>
        </button>
      }
    </div>

    <!-- Orders List -->
    <div class="orders-grid">
      @for (order of orders(); track order.id) {
        <div class="order-admin-card">
          <div class="oac-header">
            <div>
              <div class="oac-id">{{ order.id }}</div>
              <div class="oac-user">👤 {{ order.userName }}</div>
            </div>
            <div class="oac-right">
              <span class="status-pill status-{{ order.status }}">{{ statusLabel(order.status) }}</span>
              <div class="oac-amount">₹{{ order.totalAmount }}</div>
            </div>
          </div>

          <div class="oac-tests">
            @for (item of order.items; track item.testId) {
              <div class="oac-test">
                <lucide-icon name="flask-conical" [size]="13" style="color:var(--primary)"></lucide-icon>
                {{ item.testName }}
                <span class="oac-lab">· {{ item.labName }}</span>
              </div>
            }
          </div>

          <div class="oac-meta">
            <span>📅 {{ order.appointmentDate }}</span>
            <span>⏰ {{ order.appointmentSlot }}</span>
            <span>💳 {{ order.paymentMethod.toUpperCase() }}</span>
          </div>

          <div class="oac-address">
            <lucide-icon name="map-pin" [size]="13"></lucide-icon>
            {{ order.address }}
          </div>

          <!-- Status Update & Technician -->
          <div class="oac-controls">
            <select class="status-select" [value]="order.status"
              (change)="updateStatus(order, $any($event.target).value)">
              <option value="pending">⏳ Pending</option>
              <option value="sample_collected">🩸 Sample Collected</option>
              <option value="processing">🔬 Processing</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
            <input type="text" class="tech-input" placeholder="Assign technician…"
              [value]="order.technicianName || ''"
              (change)="assignTechnician(order, $any($event.target).value)" />
            <button class="oac-btn">
              <lucide-icon name="upload" [size]="14"></lucide-icon>
              Upload Report
            </button>
          </div>
        </div>
      }
      @if (orders().length === 0) {
        <div class="empty-state" style="margin:40px auto">
          <div class="emoji">📋</div>
          <h3>No orders found</h3>
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .admin-orders { display: flex; flex-direction: column; gap: 16px; }
    .ao-header { display: flex; align-items: center; justify-content: space-between; }
    .ao-title { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .ao-sub { font-size: 13px; color: var(--text-muted); }
    /* Status Tabs */
    .status-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
    .status-tabs::-webkit-scrollbar { display: none; }
    .stab { display: flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; color: var(--text-muted); background: #fff; border: 1.5px solid var(--border); cursor: pointer; white-space: nowrap; transition: var(--transition); }
    .stab.active { background: var(--primary); color: #fff; border-color: var(--primary); }
    .stab-count { background: rgba(0,0,0,.1); color: inherit; padding: 1px 7px; border-radius: 99px; font-size: 11px; font-weight: 700; }
    /* Orders Grid */
    .orders-grid { display: flex; flex-direction: column; gap: 14px; }
    .order-admin-card { background: #fff; border-radius: var(--radius-xl); padding: 18px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 10px; }
    .oac-header { display: flex; align-items: flex-start; justify-content: space-between; }
    .oac-id { font-size: 14px; font-weight: 800; color: var(--text-primary); }
    .oac-user { font-size: 13px; color: var(--text-secondary); margin-top: 2px; }
    .oac-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .oac-amount { font-size: 18px; font-weight: 900; color: var(--text-primary); }
    .oac-tests { display: flex; flex-direction: column; gap: 4px; background: var(--surface-2); border-radius: var(--radius-md); padding: 10px 12px; }
    .oac-test { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); }
    .oac-lab { font-size: 11px; color: var(--text-muted); }
    .oac-meta { display: flex; gap: 12px; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; }
    .oac-address { display: flex; align-items: flex-start; gap: 6px; font-size: 12px; color: var(--text-muted); }
    /* Controls */
    .oac-controls { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; padding-top: 8px; border-top: 1px solid var(--border-light); }
    .status-select { padding: 8px 12px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); background: #fff; font-size: 13px; color: var(--text-secondary); outline: none; cursor: pointer; }
    .tech-input { flex: 1; min-width: 160px; padding: 8px 12px; border-radius: var(--radius-sm); border: 1.5px solid var(--border); font-size: 13px; outline: none; color: var(--text-primary); }
    .oac-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); background: var(--secondary-light); color: var(--secondary-dark); border: none; font-size: 13px; font-weight: 700; cursor: pointer; }
    /* Status Pills */
    .status-pill { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 99px; }
    .status-pill.status-pending { background: #fef3c7; color: #b45309; }
    .status-pill.status-sample_collected { background: #dbeafe; color: #1d4ed8; }
    .status-pill.status-processing { background: #ede9fe; color: #6d28d9; }
    .status-pill.status-completed { background: #d1fae5; color: #065f46; }
    .status-pill.status-cancelled { background: #fee2e2; color: #991b1b; }
  `]
})
export class AdminOrdersComponent {
  data = inject(LabDataService);
  activeStatus = signal('all');

  statusTabs = [
    { id: 'all', emoji: '📋', label: 'All' },
    { id: 'pending', emoji: '⏳', label: 'Pending' },
    { id: 'sample_collected', emoji: '🩸', label: 'Sample Collected' },
    { id: 'processing', emoji: '🔬', label: 'Processing' },
    { id: 'completed', emoji: '✅', label: 'Completed' },
  ];

  orders() {
    if (this.activeStatus() === 'all') return this.data.mockOrders;
    return this.data.mockOrders.filter(o => o.status === this.activeStatus());
  }

  countByStatus(status: string) {
    if (status === 'all') return this.data.mockOrders.length;
    return this.data.mockOrders.filter(o => o.status === status).length;
  }

  statusLabel(s: string) {
    const m: Record<string, string> = { pending: 'Pending', sample_collected: 'Collected', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' };
    return m[s] || s;
  }

  updateStatus(order: LabOrder, status: string) { (order as any).status = status; }
  assignTechnician(order: LabOrder, name: string) { order.technicianName = name; }
}
