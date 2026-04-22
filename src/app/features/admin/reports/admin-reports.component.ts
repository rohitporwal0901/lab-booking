import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
  <div class="admin-reports">
    <div class="ar-header">
      <h2 class="ar-title">Upload Reports</h2>
      <div class="ar-sub">Upload PDF reports and notify patients</div>
    </div>

    <!-- Upload Zone -->
    <div class="upload-zone" [class.drag-over]="dragOver()"
      (dragover)="$event.preventDefault(); dragOver.set(true)"
      (dragleave)="dragOver.set(false)"
      (drop)="onDrop($event)">
      <div class="uz-icon">📄</div>
      <div class="uz-title">Drag & Drop PDF Reports Here</div>
      <div class="uz-sub">or click to browse files</div>
      <button class="uz-btn" (click)="fileInput.click()">
        <lucide-icon name="upload" [size]="16"></lucide-icon>
        Choose PDF
      </button>
      <input #fileInput type="file" accept=".pdf" style="display:none" (change)="onFileChange($event)" />
    </div>

    @if (uploadedFiles().length > 0) {
      <div class="uploaded-list">
        <h3 class="ul-title">Queued for Upload ({{ uploadedFiles().length }})</h3>
        @for (file of uploadedFiles(); track file.name) {
          <div class="uf-row">
            <div class="uf-icon">📄</div>
            <div class="uf-info">
              <div class="uf-name">{{ file.name }}</div>
              <div class="uf-size">{{ (file.size / 1024).toFixed(0) }} KB</div>
            </div>
            <button class="btn btn-primary btn-sm" (click)="uploadReport(file)">
              <lucide-icon name="upload" [size]="13"></lucide-icon>
              Upload
            </button>
          </div>
        }
      </div>
    }

    <!-- Completed Orders Awaiting Reports -->
    <div class="pending-reports">
      <h3 class="pr-title">Orders Awaiting Reports</h3>
      @for (order of awaitingReports(); track order.id) {
        <div class="pr-card">
          <div class="pr-left">
            <div class="pr-id">{{ order.id }}</div>
            <div class="pr-user">{{ order.userName }}</div>
            <div class="pr-tests">{{ getTestNames(order) }}</div>
            <div class="pr-date">{{ order.appointmentDate }}</div>
          </div>
          <div class="pr-right">
            <span class="status-pill" [class]="'status-' + order.status">
              {{ order.status === 'completed' ? '✅ Done' : '🔬 Processing' }}
            </span>
            <button class="pr-upload-btn">
              <lucide-icon name="upload" [size]="14"></lucide-icon>
              Upload PDF
            </button>
            <button class="pr-notify-btn">
              <lucide-icon name="send" [size]="14"></lucide-icon>
              Notify Patient
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Uploaded Reports History -->
    <div class="reports-history">
      <h3 class="rh-title">Reports Uploaded</h3>
      @for (item of uploadedHistory; track item.orderId) {
        <div class="rh-row">
          <div class="rh-icon">✅</div>
          <div class="rh-info">
            <div class="rh-order">{{ item.orderId }}</div>
            <div class="rh-patient">{{ item.patient }}</div>
            <div class="rh-date">Uploaded: {{ item.uploadedAt }}</div>
          </div>
          <div class="rh-actions">
            <button class="rh-btn">
              <lucide-icon name="eye" [size]="14"></lucide-icon>
            </button>
            <button class="rh-btn notify">
              <lucide-icon name="send" [size]="14"></lucide-icon>
            </button>
          </div>
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .admin-reports { display: flex; flex-direction: column; gap: 20px; }
    .ar-header { }
    .ar-title { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .ar-sub { font-size: 13px; color: var(--text-muted); }
    /* Upload Zone */
    .upload-zone { background: #fff; border: 2px dashed var(--primary); border-radius: var(--radius-xl); padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; transition: var(--transition); cursor: pointer; }
    .upload-zone.drag-over { background: var(--primary-light); border-style: solid; }
    .uz-icon { font-size: 48px; }
    .uz-title { font-size: 16px; font-weight: 700; color: var(--text-primary); }
    .uz-sub { font-size: 13px; color: var(--text-muted); }
    .uz-btn { display: flex; align-items: center; gap: 8px; background: var(--primary); color: #fff; padding: 10px 22px; border-radius: var(--radius-full); border: none; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-primary); }
    /* Uploaded List */
    .uploaded-list { background: #fff; border-radius: var(--radius-xl); padding: 18px; box-shadow: var(--shadow-sm); }
    .ul-title { font-size: 14px; font-weight: 700; margin-bottom: 12px; }
    .uf-row { display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--surface-2); border-radius: var(--radius-md); margin-bottom: 8px; }
    .uf-icon { font-size: 24px; }
    .uf-info { flex: 1; }
    .uf-name { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .uf-size { font-size: 11px; color: var(--text-muted); }
    /* Pending Reports */
    .pending-reports { display: flex; flex-direction: column; gap: 10px; }
    .pr-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .pr-card { background: #fff; border-radius: var(--radius-xl); padding: 16px; box-shadow: var(--shadow-sm); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .pr-left { display: flex; flex-direction: column; gap: 3px; }
    .pr-id { font-size: 13px; font-weight: 800; color: var(--text-primary); }
    .pr-user { font-size: 13px; color: var(--text-secondary); }
    .pr-tests { font-size: 12px; color: var(--text-muted); max-width: 280px; }
    .pr-date { font-size: 11px; color: var(--text-muted); }
    .pr-right { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
    .status-pill.status-completed { background: #d1fae5; color: #065f46; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
    .status-pill.status-processing { background: #ede9fe; color: #6d28d9; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 99px; }
    .pr-upload-btn, .pr-notify-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; cursor: pointer; border: none; }
    .pr-upload-btn { background: var(--primary-light); color: var(--primary-dark); }
    .pr-notify-btn { background: var(--secondary-light); color: var(--secondary-dark); }
    /* History */
    .reports-history { display: flex; flex-direction: column; gap: 10px; }
    .rh-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .rh-row { background: #fff; border-radius: var(--radius-lg); padding: 14px; display: flex; align-items: center; gap: 12px; box-shadow: var(--shadow-sm); }
    .rh-icon { font-size: 24px; flex-shrink: 0; }
    .rh-info { flex: 1; }
    .rh-order { font-size: 13px; font-weight: 800; color: var(--text-primary); }
    .rh-patient { font-size: 12px; color: var(--text-secondary); }
    .rh-date { font-size: 11px; color: var(--text-muted); }
    .rh-actions { display: flex; gap: 6px; }
    .rh-btn { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; background: var(--surface-3); color: var(--text-secondary); }
    .rh-btn.notify { background: var(--secondary-light); color: var(--secondary-dark); }
  `]
})
export class AdminReportsComponent {
  data = inject(LabDataService);
  dragOver = signal(false);
  uploadedFiles = signal<File[]>([]);

  uploadedHistory = [
    { orderId: 'ORD-1001', patient: 'Rahul Sharma', uploadedAt: '22 Apr 2025, 10:30 AM' },
  ];

  awaitingReports() {
    return this.data.mockOrders.filter(o => o.status === 'processing' || (o.status === 'completed' && !o.reportUrl));
  }

  getTestNames(order: any): string {
    return order.items.map((i: any) => i.testName).join(', ');
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.uploadedFiles.update(f => [...f, ...Array.from(input.files!)]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver.set(false);
    const files = Array.from(event.dataTransfer?.files || []);
    this.uploadedFiles.update(f => [...f, ...files]);
  }

  uploadReport(file: File) {
    this.uploadedFiles.update(f => f.filter(x => x !== file));
    alert(`Report "${file.name}" uploaded successfully!`);
  }
}
