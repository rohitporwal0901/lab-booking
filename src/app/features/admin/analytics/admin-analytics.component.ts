import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
  <div class="analytics-page">
    <div class="an-header">
      <h2 class="an-title">Analytics</h2>
      <div class="period-tabs">
        @for (p of periods; track p) {
          <button class="period-btn" [class.active]="p === 'Monthly'">{{ p }}</button>
        }
      </div>
    </div>

    <!-- Revenue Chart (Visual Bars) -->
    <div class="chart-card">
      <div class="cc-header">
        <h3 class="cc-title">📈 Revenue Trend</h3>
        <div class="cc-total">₹4,21,830 this month</div>
      </div>
      <div class="bar-chart">
        @for (d of chartData; track d.month) {
          <div class="bc-col">
            <div class="bc-bar-wrap">
              <div class="bc-bar" [style.height.%]="d.pct"
                [style.background]="d.pct >= 80 ? 'linear-gradient(180deg,#0ea5e9,#0284c7)' : 'linear-gradient(180deg,#93c5fd,#bfdbfe)'">
                <div class="bc-tooltip">₹{{ d.value }}</div>
              </div>
            </div>
            <div class="bc-label">{{ d.month }}</div>
          </div>
        }
      </div>
    </div>

    <!-- KPI Row -->
    <div class="analytics-kpis">
      @for (kpi of analyticsKpis; track kpi.label) {
        <div class="an-kpi-card">
          <div class="an-kpi-emoji">{{ kpi.emoji }}</div>
          <div class="an-kpi-val">{{ kpi.value }}</div>
          <div class="an-kpi-label">{{ kpi.label }}</div>
          <div class="an-kpi-trend" [class.up]="kpi.up">
            {{ kpi.up ? '↑' : '↓' }} {{ kpi.change }} vs last month
          </div>
        </div>
      }
    </div>

    <!-- Top Categories -->
    <div class="chart-card">
      <div class="cc-header">
        <h3 class="cc-title">🏆 Top Test Categories</h3>
      </div>
      <div class="category-bars">
        @for (cat of categoryPerformance; track cat.name) {
          <div class="cat-bar-row">
            <div class="cbr-info">
              <div class="cbr-emoji">{{ cat.emoji }}</div>
              <div class="cbr-name">{{ cat.name }}</div>
            </div>
            <div class="cbr-bar-wrap">
              <div class="cbr-bar" [style.width.%]="cat.pct" [style.background]="cat.color"></div>
            </div>
            <div class="cbr-count">{{ cat.count }}</div>
          </div>
        }
      </div>
    </div>

    <!-- Booking Hours Heatmap -->
    <div class="chart-card">
      <div class="cc-header">
        <h3 class="cc-title">⏰ Peak Booking Hours</h3>
      </div>
      <div class="hour-grid">
        @for (h of peakHours; track h.hour) {
          <div class="hour-cell" [style.background]="heatColor(h.pct)" [title]="h.hour + ' – ' + h.count + ' bookings'">
            <div class="hour-label">{{ h.hour }}</div>
          </div>
        }
      </div>
    </div>

    <!-- Recent Metrics -->
    <div class="chart-card">
      <div class="cc-header">
        <h3 class="cc-title">📊 Daily Bookings (Last Week)</h3>
      </div>
      <div class="daily-bars">
        @for (d of dailyBookings; track d.day) {
          <div class="db-col">
            <div class="db-count">{{ d.count }}</div>
            <div class="db-bar" [style.height.px]="d.count * 3" style="background:linear-gradient(180deg,#10b981,#059669)"></div>
            <div class="db-day">{{ d.day }}</div>
          </div>
        }
      </div>
    </div>
  </div>
  `,
  styles: [`
    .analytics-page { display: flex; flex-direction: column; gap: 20px; }
    .an-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .an-title { font-size: 20px; font-weight: 800; color: var(--text-primary); }
    .period-tabs { display: flex; gap: 6px; }
    .period-btn { padding: 7px 14px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; color: var(--text-muted); background: var(--surface-3); border: none; cursor: pointer; }
    .period-btn.active { background: var(--primary); color: #fff; }
    /* Chart Card */
    .chart-card { background: #fff; border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-sm); }
    .cc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .cc-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .cc-total { font-size: 14px; font-weight: 800; color: var(--secondary); }
    /* Bar Chart */
    .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 160px; padding-bottom: 24px; position: relative; }
    .bc-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
    .bc-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
    .bc-bar { width: 100%; border-radius: 6px 6px 0 0; transition: height 0.5s ease; position: relative; min-height: 8px; cursor: pointer; }
    .bc-bar:hover .bc-tooltip { display: block; }
    .bc-tooltip { display: none; position: absolute; top: -28px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 6px; white-space: nowrap; }
    .bc-label { font-size: 11px; font-weight: 600; color: var(--text-muted); position: absolute; bottom: 0; }
    /* Analytics KPIs */
    .analytics-kpis { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    @media (min-width: 768px) { .analytics-kpis { grid-template-columns: repeat(4, 1fr); } }
    .an-kpi-card { background: #fff; border-radius: var(--radius-xl); padding: 18px; box-shadow: var(--shadow-sm); text-align: center; }
    .an-kpi-emoji { font-size: 28px; margin-bottom: 8px; }
    .an-kpi-val { font-size: 24px; font-weight: 900; color: var(--text-primary); }
    .an-kpi-label { font-size: 12px; color: var(--text-muted); margin: 4px 0; }
    .an-kpi-trend { font-size: 11px; font-weight: 700; color: var(--danger); }
    .an-kpi-trend.up { color: var(--secondary); }
    /* Category Bars */
    .category-bars { display: flex; flex-direction: column; gap: 12px; }
    .cat-bar-row { display: flex; align-items: center; gap: 12px; }
    .cbr-info { display: flex; align-items: center; gap: 6px; min-width: 140px; }
    .cbr-emoji { font-size: 18px; }
    .cbr-name { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
    .cbr-bar-wrap { flex: 1; height: 10px; background: var(--surface-3); border-radius: 99px; overflow: hidden; }
    .cbr-bar { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
    .cbr-count { font-size: 12px; font-weight: 700; color: var(--text-primary); width: 36px; text-align: right; }
    /* Heatmap */
    .hour-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
    @media (min-width: 480px) { .hour-grid { grid-template-columns: repeat(8, 1fr); } }
    @media (min-width: 768px) { .hour-grid { grid-template-columns: repeat(12, 1fr); } }
    .hour-cell { border-radius: 6px; padding: 8px 4px; text-align: center; cursor: default; transition: var(--transition); }
    .hour-cell:hover { transform: scale(1.1); }
    .hour-label { font-size: 10px; font-weight: 600; color: rgba(0,0,0,.5); }
    /* Daily Bars */
    .daily-bars { display: flex; align-items: flex-end; gap: 12px; height: 120px; }
    .db-col { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; height: 100%; }
    .db-count { font-size: 11px; font-weight: 700; color: var(--text-secondary); }
    .db-bar { width: 100%; border-radius: 6px 6px 0 0; min-height: 4px; }
    .db-day { font-size: 11px; color: var(--text-muted); font-weight: 600; }
  `]
})
export class AdminAnalyticsComponent {
  periods = ['Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  chartData = [
    { month: 'Nov', value: '2.1L', pct: 50 },
    { month: 'Dec', value: '2.8L', pct: 65 },
    { month: 'Jan', value: '3.2L', pct: 76 },
    { month: 'Feb', value: '2.9L', pct: 69 },
    { month: 'Mar', value: '3.8L', pct: 90 },
    { month: 'Apr', value: '4.2L', pct: 100 },
  ];

  analyticsKpis = [
    { emoji: '📦', label: 'Total Orders', value: '1,248', change: '12%', up: true },
    { emoji: '💰', label: 'Revenue', value: '₹4.2L', change: '8%', up: true },
    { emoji: '👤', label: 'New Users', value: '342', change: '22%', up: true },
    { emoji: '⭐', label: 'Avg Rating', value: '4.7', change: '3%', up: false },
  ];

  categoryPerformance = [
    { emoji: '🩸', name: 'Blood Tests', count: 428, pct: 100, color: '#ef4444' },
    { emoji: '🫀', name: 'Full Body', count: 312, pct: 73, color: '#f97316' },
    { emoji: '🦋', name: 'Thyroid', count: 218, pct: 51, color: '#3b82f6' },
    { emoji: '🍬', name: 'Diabetes', count: 189, pct: 44, color: '#eab308' },
    { emoji: '❤️', name: 'Cardiac', count: 143, pct: 33, color: '#e11d48' },
    { emoji: '☀️', name: 'Vitamins', count: 98, pct: 23, color: '#f59e0b' },
  ];

  peakHours = [
    { hour: '6AM', count: 48, pct: 80 }, { hour: '7AM', count: 89, pct: 100 },
    { hour: '8AM', count: 72, pct: 81 }, { hour: '9AM', count: 65, pct: 73 },
    { hour: '10AM', count: 42, pct: 47 }, { hour: '11AM', count: 31, pct: 35 },
    { hour: '12PM', count: 22, pct: 25 }, { hour: '1PM', count: 18, pct: 20 },
    { hour: '2PM', count: 15, pct: 17 }, { hour: '3PM', count: 20, pct: 22 },
    { hour: '4PM', count: 28, pct: 31 }, { hour: '5PM', count: 35, pct: 39 },
  ];

  dailyBookings = [
    { day: 'Mon', count: 34 }, { day: 'Tue', count: 42 }, { day: 'Wed', count: 38 },
    { day: 'Thu', count: 55 }, { day: 'Fri', count: 48 }, { day: 'Sat', count: 62 }, { day: 'Sun', count: 29 },
  ];

  heatColor(pct: number): string {
    const alpha = 0.1 + (pct / 100) * 0.85;
    return `rgba(14, 165, 233, ${alpha.toFixed(2)})`;
  }
}
