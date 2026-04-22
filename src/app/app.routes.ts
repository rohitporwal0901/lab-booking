import { Routes } from '@angular/router';

export const routes: Routes = [
  // ── User (Patient) Routes ──────────────────────────────
  {
    path: '',
    loadComponent: () => import('./layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/user/home/home.component').then(m => m.HomeComponent) },
      { path: 'category/:id', loadComponent: () => import('./features/user/category-tests/category-tests.component').then(m => m.CategoryTestsComponent) },
      { path: 'test/:id', loadComponent: () => import('./features/user/test-detail/test-detail.component').then(m => m.TestDetailComponent) },
      { path: 'cart', loadComponent: () => import('./features/user/cart/cart.component').then(m => m.CartComponent) },
      { path: 'checkout', loadComponent: () => import('./features/user/checkout/checkout.component').then(m => m.CheckoutComponent) },
      { path: 'dashboard', loadComponent: () => import('./features/user/dashboard/dashboard.component').then(m => m.UserDashboardComponent) },
      { path: 'profile', loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  // ── Admin Routes ───────────────────────────────────────
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'tests', loadComponent: () => import('./features/admin/manage-tests/manage-tests.component').then(m => m.ManageTestsComponent) },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/admin-orders.component').then(m => m.AdminOrdersComponent) },
      { path: 'reports', loadComponent: () => import('./features/admin/reports/admin-reports.component').then(m => m.AdminReportsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'analytics', loadComponent: () => import('./features/admin/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
