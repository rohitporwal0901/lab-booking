import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { LabDataService } from '../../../core/services/lab-data.service';
import { LabTest } from '../../../core/models/lab-test.model';

@Component({
  selector: 'app-manage-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
  <div class="manage-tests">
    <!-- Header -->
    <div class="mt-header">
      <div>
        <h2 class="mt-title">Manage Tests</h2>
        <div class="mt-sub">{{ data.tests.length }} tests in catalog</div>
      </div>
      <button class="add-test-btn" (click)="showModal.set(true)">
        <lucide-icon name="plus" [size]="18"></lucide-icon>
        Add New Test
      </button>
    </div>

    <!-- Search & Filter Row -->
    <div class="search-row">
      <div class="search-box">
        <lucide-icon name="search" [size]="16"></lucide-icon>
        <input type="text" placeholder="Search tests…" class="search-input" [(ngModel)]="searchQ" />
      </div>
      <select class="filter-select" [(ngModel)]="categoryFilter">
        <option value="">All Categories</option>
        @for (cat of data.categories; track cat.id) {
          <option [value]="cat.id">{{ cat.name }}</option>
        }
      </select>
    </div>

    <!-- Tests Table/Cards -->
    <div class="tests-grid">
      @for (test of filteredTests(); track test.id) {
        <div class="test-admin-card">
          <div class="tac-header">
            <div class="tac-badges">
              @if (test.popular) { <span class="badge badge-danger">🔥</span> }
              @if (test.homeCollection) { <span class="badge badge-success">🏠</span> }
            </div>
            <div class="tac-actions">
              <button class="action-btn edit" (click)="editTest(test)">
                <lucide-icon name="edit-2" [size]="14"></lucide-icon>
              </button>
              <button class="action-btn delete">
                <lucide-icon name="trash-2" [size]="14"></lucide-icon>
              </button>
            </div>
          </div>
          <div class="tac-name">{{ test.name }}</div>
          <div class="tac-cat">{{ test.category }}</div>
          <div class="tac-lab">{{ test.labName }}</div>
          <div class="tac-price-row">
            <div class="tac-price">₹{{ test.discountedPrice }}</div>
            @if (test.discountPercent > 0) {
              <span class="tac-off">{{ test.discountPercent }}% OFF</span>
            }
          </div>
          <div class="tac-meta">
            <span class="tac-chip">⭐ {{ test.rating }}</span>
            <span class="tac-chip">{{ test.parameters.length }} params</span>
            <span class="tac-chip">⏱ {{ test.duration }}</span>
          </div>
        </div>
      }
      @if (filteredTests().length === 0) {
        <div class="empty-state" style="grid-column: 1/-1">
          <div class="emoji">🔬</div>
          <h3>No tests found</h3>
        </div>
      }
    </div>
  </div>

  <!-- Add/Edit Modal -->
  @if (showModal()) {
    <div class="overlay" (click)="showModal.set(false)"></div>
    <div class="modal">
      <div class="modal-header">
        <h3>{{ editing() ? 'Edit Test' : 'Add New Test' }}</h3>
        <button class="modal-close" (click)="showModal.set(false)">
          <lucide-icon name="x" [size]="20"></lucide-icon>
        </button>
      </div>
      <form class="modal-form" (ngSubmit)="saveTest()">
        <div class="form-group">
          <label class="form-label">Test Name *</label>
          <input class="input" type="text" [(ngModel)]="form.name" name="name" placeholder="e.g. Complete Blood Count" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="input" [(ngModel)]="form.categoryId" name="categoryId">
              @for (cat of data.categories; track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Lab Name</label>
            <input class="input" type="text" [(ngModel)]="form.labName" name="labName" placeholder="e.g. Apollo Diagnostics" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">MRP Price (₹) *</label>
            <input class="input" type="number" [(ngModel)]="form.price" name="price" placeholder="999" />
          </div>
          <div class="form-group">
            <label class="form-label">Discount %</label>
            <input class="input" type="number" [(ngModel)]="form.discountPercent" name="discount" placeholder="20" min="0" max="90" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Report Time</label>
            <input class="input" type="text" [(ngModel)]="form.duration" name="duration" placeholder="24 hours" />
          </div>
          <div class="form-group">
            <label class="form-label">Report Delivery</label>
            <input class="input" type="text" [(ngModel)]="form.reportDelivery" name="reportDelivery" placeholder="24 hours" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="input" rows="3" [(ngModel)]="form.description" name="description" placeholder="Test description…"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Preparation Instructions</label>
          <textarea class="input" rows="2" [(ngModel)]="form.preparation" name="preparation" placeholder="Fasting required…"></textarea>
        </div>
        <div class="toggle-row">
          <label class="toggle-label">
            <input type="checkbox" [(ngModel)]="form.homeCollection" name="homeCollection" />
            🏠 Home Sample Collection
          </label>
          <label class="toggle-label">
            <input type="checkbox" [(ngModel)]="form.fastingRequired" name="fastingRequired" />
            ⏱ Fasting Required
          </label>
          <label class="toggle-label">
            <input type="checkbox" [(ngModel)]="form.popular" name="popular" />
            🔥 Mark as Popular
          </label>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-ghost" (click)="showModal.set(false)">Cancel</button>
          <button type="submit" class="btn btn-primary">
            {{ editing() ? 'Update Test' : 'Add Test' }}
          </button>
        </div>
      </form>
    </div>
  }
  `,
  styles: [`
    .manage-tests { display: flex; flex-direction: column; gap: 16px; }
    .mt-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .mt-title { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .mt-sub { font-size: 13px; color: var(--text-muted); }
    .add-test-btn { display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg,var(--primary),var(--primary-dark)); color: #fff; padding: 10px 20px; border-radius: var(--radius-lg); border: none; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-primary); }
    /* Search Row */
    .search-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px; background: #fff; border-radius: var(--radius-lg); padding: 10px 14px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); }
    .search-box lucide-icon { color: var(--text-muted); flex-shrink: 0; }
    .search-input { flex: 1; border: none; outline: none; font-size: 14px; color: var(--text-primary); background: transparent; }
    .filter-select { padding: 10px 14px; border-radius: var(--radius-lg); border: 1px solid var(--border); background: #fff; font-size: 14px; color: var(--text-secondary); outline: none; cursor: pointer; }
    /* Tests Grid */
    .tests-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    @media (min-width: 640px) { .tests-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .tests-grid { grid-template-columns: repeat(3, 1fr); } }
    .test-admin-card { background: #fff; border-radius: var(--radius-lg); padding: 16px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 6px; }
    .tac-header { display: flex; align-items: center; justify-content: space-between; }
    .tac-badges { display: flex; gap: 4px; }
    .tac-actions { display: flex; gap: 6px; }
    .action-btn { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    .action-btn.edit { background: var(--primary-light); color: var(--primary); }
    .action-btn.delete { background: #fee2e2; color: var(--danger); }
    .tac-name { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .tac-cat { font-size: 12px; color: var(--primary); font-weight: 600; background: var(--primary-light); padding: 2px 8px; border-radius: 99px; display: inline-block; }
    .tac-lab { font-size: 12px; color: var(--text-muted); }
    .tac-price-row { display: flex; align-items: center; gap: 8px; }
    .tac-price { font-size: 20px; font-weight: 900; color: var(--text-primary); }
    .tac-off { font-size: 12px; font-weight: 700; background: var(--secondary-light); color: var(--secondary-dark); padding: 2px 8px; border-radius: 99px; }
    .tac-meta { display: flex; gap: 6px; flex-wrap: wrap; }
    .tac-chip { font-size: 11px; background: var(--surface-3); color: var(--text-secondary); padding: 3px 8px; border-radius: 99px; font-weight: 500; }
    /* Modal Form */
    .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .modal-header h3 { font-size: 18px; font-weight: 700; }
    .modal-close { width: 32px; height: 32px; border-radius: 50%; background: var(--surface-3); display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
    .modal-form { display: flex; flex-direction: column; gap: 14px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
    .toggle-row { display: flex; flex-wrap: wrap; gap: 12px; }
    .toggle-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: var(--text-secondary); cursor: pointer; }
    .toggle-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; }
  `]
})
export class ManageTestsComponent {
  data = inject(LabDataService);
  showModal = signal(false);
  editing = signal(false);
  searchQ = '';
  categoryFilter = '';

  form: Partial<LabTest> = this.defaultForm();

  defaultForm(): Partial<LabTest> {
    return { name: '', categoryId: '', labName: '', price: 0, discountPercent: 0, duration: '24 hours', reportDelivery: '24 hours', description: '', preparation: '', homeCollection: true, fastingRequired: false, popular: false };
  }

  filteredTests() {
    return this.data.tests.filter(t => {
      const matchQ = !this.searchQ || t.name.toLowerCase().includes(this.searchQ.toLowerCase());
      const matchCat = !this.categoryFilter || t.categoryId === this.categoryFilter;
      return matchQ && matchCat;
    });
  }

  editTest(test: LabTest) {
    this.form = { ...test };
    this.editing.set(true);
    this.showModal.set(true);
  }

  saveTest() {
    // In a real app, this would call a service/API
    this.showModal.set(false);
    this.form = this.defaultForm();
    this.editing.set(false);
  }
}
