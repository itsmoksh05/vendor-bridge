import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Dashboard';

    if (pathname === '/vendors') return 'Vendor Directory';
    if (pathname === '/vendors/add') return 'Onboard New Vendor';
    if (pathname.startsWith('/vendors/') && pathname.endsWith('/edit')) return 'Edit Vendor Details';
    if (pathname.startsWith('/vendors/')) return 'Vendor Profile';

    if (pathname === '/rfq') return 'RFQs';
    if (pathname === '/rfq/create') return 'Create RFQ';
    if (pathname.startsWith('/rfq/') && pathname.includes('/compare')) return 'Compare Quotations';
    if (pathname.startsWith('/rfq/')) return 'RFQ Details';

    if (pathname === '/quotations') return 'Quotation Board';
    if (pathname.startsWith('/quotations/submit/')) return 'Submit Quotation';

    if (pathname === '/approvals') return 'Approvals';
    if (pathname.startsWith('/approvals/')) return 'Approval Details';

    if (pathname === '/purchase-orders') return 'Purchase Orders';
    if (pathname.startsWith('/purchase-orders/')) return 'Purchase Order Details';

    if (pathname === '/invoices') return 'Invoices & Billing';
    if (pathname.startsWith('/invoices/')) return 'Invoice Details';

    if (pathname === '/activity') return 'Activity Logs';
    if (pathname === '/reports') return 'Reports';

    return 'VendorBridge';
  };

  const title = getPageTitle(path);

  return (
    <div className="app-shell flex min-h-screen bg-[#090D18] text-[#F9FAFB]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pl-16 md:pl-60 relative z-10">
        <Topbar title={title} />

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
