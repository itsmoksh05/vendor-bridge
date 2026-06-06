import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  // Function to translate pathname into high-fidelity titles
  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'ERP Dashboard';

    if (pathname === '/vendors') return 'Vendor Directory';
    if (pathname === '/vendors/add') return 'Onboard New Vendor';
    if (pathname.startsWith('/vendors/') && pathname.endsWith('/edit')) return 'Edit Vendor Details';
    if (pathname.startsWith('/vendors/')) return 'Vendor Profile';

    if (pathname === '/rfq') return 'Request For Quotations (RFQs)';
    if (pathname === '/rfq/create') return 'Create New RFQ';
    if (pathname.startsWith('/rfq/') && pathname.includes('/compare')) return 'Compare Quotations';
    if (pathname.startsWith('/rfq/')) return 'RFQ Details';

    if (pathname === '/quotations') return 'Quotation Board';
    if (pathname.startsWith('/quotations/submit/')) return 'Submit Quotation';

    if (pathname === '/approvals') return 'Workflow Approval Board';
    if (pathname.startsWith('/approvals/')) return 'Approval Details';

    if (pathname === '/purchase-orders') return 'Purchase Orders';
    if (pathname.startsWith('/purchase-orders/')) return 'Purchase Order Details';

    if (pathname === '/invoices') return 'Invoices & Billing';
    if (pathname.startsWith('/invoices/')) return 'Invoice Details';

    if (pathname === '/activity') return 'System Activity Logs';
    if (pathname === '/reports') return 'Procurement Reports & Analytics';

    return 'VendorBridge ERP';
  };

  const title = getPageTitle(path);

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] text-[#F9FAFB] font-body">
      {/* Sidebar - fixed width will offset the content container */}
      <Sidebar />

      {/* Main Content Area */}
      {/* 
        We use group active spacing.
        If Sidebar is 240px (w-60), offset the main content by ml-60 on large screens.
        If Sidebar is 64px (w-16) when collapsed, offset is ml-16.
        Since we want the layout to remain responsive:
        Sidebar is fixed. Let's make the content wrapper flex-1 and manage padding.
        A clean way is to set padding-left on the container.
        Since the sidebar state is inside Sidebar, let's keep it simple:
        We can either:
        1. Set a standard left margin that changes based on screen width, e.g., pl-16 md:pl-60.
        Let's match sidebar: Sidebar has fixed class with width 60 (240px), collapsed is 16 (64px).
        Let's just use CSS or standard margins in the container.
        Wait! Since we can also use dynamic state or just Tailwind classes:
        Let's give the main content container `flex-1 pl-[64px] transition-all duration-300` on mobile,
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 pl-16 md:pl-60 relative z-10">
        <Topbar title={title} />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
