import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Public Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import NotFoundPage from '../pages/NotFoundPage';

// Authenticated Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import VendorListPage from '../pages/vendors/VendorListPage';
import VendorFormPage from '../pages/vendors/VendorFormPage';
import VendorDetailPage from '../pages/vendors/VendorDetailPage';
import RFQListPage from '../pages/rfq/RFQListPage';
import RFQCreatePage from '../pages/rfq/RFQCreatePage';
import RFQDetailPage from '../pages/rfq/RFQDetailPage';
import QuotationListPage from '../pages/quotations/QuotationListPage';
import QuotationSubmitPage from '../pages/quotations/QuotationSubmitPage';
import QuotationComparisonPage from '../pages/quotations/QuotationComparisonPage';
import ApprovalListPage from '../pages/approvals/ApprovalListPage';
import ApprovalDetailPage from '../pages/approvals/ApprovalDetailPage';
import POListPage from '../pages/purchase-orders/POListPage';
import PODetailPage from '../pages/purchase-orders/PODetailPage';
import InvoiceListPage from '../pages/invoices/InvoiceListPage';
import InvoiceDetailPage from '../pages/invoices/InvoiceDetailPage';
import ActivityLogsPage from '../pages/activity/ActivityLogsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import ProfileSettingsPage from '../pages/settings/ProfileSettingsPage';
import SystemSettingsPage from '../pages/settings/SystemSettingsPage';

// User role configurations
const ROLES = {
  ADMIN: 'ADMIN',
  OFFICER: 'PROCUREMENT_OFFICER',
  VENDOR: 'VENDOR',
  MANAGER: 'MANAGER',
};

// Route wrapper for authenticated users
export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect unauthorized roles to their default page
    if (user?.role === ROLES.VENDOR) {
      return <Navigate to="/quotations" replace />;
    } else if (user?.role === ROLES.MANAGER) {
      return <Navigate to="/approvals" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

// Route wrapper for non-authenticated users
export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    if (user?.role === ROLES.VENDOR) {
      return <Navigate to="/quotations" replace />;
    } else if (user?.role === ROLES.MANAGER) {
      return <Navigate to="/approvals" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export const router = createBrowserRouter([
  // Public Landing Page
  {
    path: '/',
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  // Auth Routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },
  // Protected Admin/Officer/Manager Layout Pages
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      // Vendors
      {
        path: '/vendors',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <VendorListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vendors/add',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
            <VendorFormPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vendors/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <VendorDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vendors/:id/edit',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
            <VendorFormPage />
          </ProtectedRoute>
        ),
      },
      // RFQs
      {
        path: '/rfq',
        element: <RFQListPage />,
      },
      {
        path: '/rfq/create',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
            <RFQCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/rfq/:id',
        element: <RFQDetailPage />,
      },
      {
        path: '/rfq/:rfqId/compare',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER]}>
            <QuotationComparisonPage />
          </ProtectedRoute>
        ),
      },
      // Quotations
      {
        path: '/quotations',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.VENDOR]}>
            <QuotationListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quotations/submit/:rfqId',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.VENDOR]}>
            <QuotationSubmitPage />
          </ProtectedRoute>
        ),
      },
      // Approvals
      {
        path: '/approvals',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ApprovalListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/approvals/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
            <ApprovalDetailPage />
          </ProtectedRoute>
        ),
      },
      // POs
      {
        path: '/purchase-orders',
        element: <POListPage />,
      },
      {
        path: '/purchase-orders/:id',
        element: <PODetailPage />,
      },
      // Invoices
      {
        path: '/invoices',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <InvoiceListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/invoices/:id',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <InvoiceDetailPage />
          </ProtectedRoute>
        ),
      },
      // Logs and Reports
      {
        path: '/activity',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <ActivityLogsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: <ProfileSettingsPage />,
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OFFICER, ROLES.MANAGER]}>
            <SystemSettingsPage />
          </ProtectedRoute>
        ),
      },
      // Keep Admin Placeholder user route
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <div className="p-6 bg-[#111827] border border-[#1F2937] rounded-xl text-center">
              <h2 className="text-xl font-bold">User Management Console</h2>
              <p className="text-sm text-[#9CA3AF] mt-2">Manage ERP access rights and user roles here.</p>
            </div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // 404 Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
