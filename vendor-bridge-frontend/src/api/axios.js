import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vb_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 unauthorized
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a network error (backend server is not running), use local mock fallback
    if (!error.response) {
      console.warn(`[VendorBridge API MOCK] Backend offline. Simulating: ${error.config.method.toUpperCase()} ${error.config.url}`);
      return simulateBackend(error.config);
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('vb_token');
      localStorage.removeItem('vb_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// --- SIMULATED BACKEND ENGINE (Lending to offline hackathon demo capability) ---

// Helper to get or set items in localStorage
const getStored = (key, defaultVal) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  return JSON.parse(data);
};

const setStored = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Default Mock Data
const DEFAULT_VENDORS = [
  { id: 'v1', name: 'Acme Corp', email: 'vendor@vendorbridge.com', contact: 'John Doe', phone: '+1 555-0199', category: 'IT Hardware', rating: 4.8, status: 'active', address: '123 Acme Way, Tech City' },
  { id: 'v2', name: 'Globex Corporation', email: 'globex@vendorbridge.com', contact: 'Hank Scorpio', phone: '+1 555-0144', category: 'Office Supplies', rating: 4.2, status: 'active', address: '456 Globex Plaza, Cypress Creek' },
  { id: 'v3', name: 'Initech LLC', email: 'initech@vendorbridge.com', contact: 'Peter Gibbons', phone: '+1 555-0188', category: 'Software Licensing', rating: 4.5, status: 'active', address: '789 Initech Rd, Austin' },
  { id: 'v4', name: 'Umbrella Corp', email: 'umbrella@vendorbridge.com', contact: 'Albert Wesker', phone: '+1 555-0166', category: 'Lab Equipment', rating: 3.9, status: 'pending', address: '101 Raccoon Dr, Hive City' },
  { id: 'v5', name: 'Cyberdyne Systems', email: 'cyberdyne@vendorbridge.com', contact: 'Miles Dyson', phone: '+1 555-0177', category: 'Industrial Machinery', rating: 4.7, status: 'active', address: '2048 Future Way, Los Angeles' },
];

const DEFAULT_RFQS = [
  {
    id: 'rfq-001',
    rfqNumber: 'RFQ-2026-001',
    title: 'Developer Laptops Procurement',
    description: 'Procuring 25 high-end developer laptops (32GB RAM, 1TB SSD).',
    category: 'IT Hardware',
    status: 'open',
    deadline: '2026-06-20',
    createdAt: '2026-06-01',
    items: [
      { id: 'item1', description: 'Developer Laptops (32GB RAM, 16" Screen)', quantity: 25, unit: 'pcs' }
    ],
    assignedVendors: ['v1', 'v2', 'v3'],
  },
  {
    id: 'rfq-002',
    rfqNumber: 'RFQ-2026-002',
    title: 'HQ Office Stationery Annual Supply',
    description: 'Annual supply of paper, notebook, pens, and desk organization items.',
    category: 'Office Supplies',
    status: 'closed',
    deadline: '2026-05-30',
    createdAt: '2026-05-10',
    items: [
      { id: 'item2', description: 'A4 Printing Paper Boxes', quantity: 100, unit: 'boxes' },
      { id: 'item3', description: 'Premium Ballpoint Pens (Blue/Black)', quantity: 500, unit: 'pcs' }
    ],
    assignedVendors: ['v2'],
  },
  {
    id: 'rfq-003',
    rfqNumber: 'RFQ-2026-003',
    title: 'Cloud Infrastructure Upgrade Services',
    description: 'Migration services and ongoing cloud setup optimization.',
    category: 'Software Licensing',
    status: 'awarded',
    deadline: '2026-06-05',
    createdAt: '2026-05-20',
    items: [
      { id: 'item4', description: 'Cloud Architect Consultation', quantity: 80, unit: 'hours' }
    ],
    assignedVendors: ['v1', 'v3'],
  }
];

const DEFAULT_QUOTATIONS = [
  {
    id: 'q-001',
    rfqId: 'rfq-001',
    rfqNumber: 'RFQ-2026-001',
    vendorId: 'v1',
    vendorName: 'Acme Corp',
    items: [
      { id: 'item1', description: 'Developer Laptops (32GB RAM, 16" Screen)', quantity: 25, unit: 'pcs', unitPrice: 1500, total: 37500 }
    ],
    subtotal: 37500,
    tax: 3750,
    totalAmount: 41250,
    deliveryDays: 10,
    validUntil: '2026-07-01',
    status: 'pending',
    notes: 'Offering premium 3-year warranty included in this quote.',
    createdAt: '2026-06-03'
  },
  {
    id: 'q-002',
    rfqId: 'rfq-001',
    rfqNumber: 'RFQ-2026-001',
    vendorId: 'v2',
    vendorName: 'Globex Corporation',
    items: [
      { id: 'item1', description: 'Developer Laptops (32GB RAM, 16" Screen)', quantity: 25, unit: 'pcs', unitPrice: 1450, total: 36250 }
    ],
    subtotal: 36250,
    tax: 3625,
    totalAmount: 39875,
    deliveryDays: 15,
    validUntil: '2026-06-30',
    status: 'pending',
    notes: 'Standard 1-year warranty.',
    createdAt: '2026-06-04'
  },
  {
    id: 'q-003',
    rfqId: 'rfq-001',
    rfqNumber: 'RFQ-2026-001',
    vendorId: 'v3',
    vendorName: 'Initech LLC',
    items: [
      { id: 'item1', description: 'Developer Laptops (32GB RAM, 16" Screen)', quantity: 25, unit: 'pcs', unitPrice: 1600, total: 40000 }
    ],
    subtotal: 40000,
    tax: 4000,
    totalAmount: 44000,
    deliveryDays: 5,
    validUntil: '2026-07-15',
    status: 'pending',
    notes: 'Fast delivery guaranteed within 5 business days.',
    createdAt: '2026-06-05'
  }
];

const DEFAULT_APPROVALS = [
  {
    id: 'app-001',
    title: 'Award RFQ-2026-003: Cloud Services',
    rfqId: 'rfq-003',
    rfqNumber: 'RFQ-2026-003',
    vendorId: 'v3',
    vendorName: 'Initech LLC',
    amount: 12800,
    requestedBy: 'Sarah Jenkins',
    status: 'approved',
    createdAt: '2026-06-05',
    notes: 'Initech had the best hourly rate and delivery schedule.'
  }
];

const DEFAULT_POS = [
  {
    id: 'po-001',
    poNumber: 'PO-2026-001',
    rfqId: 'rfq-003',
    rfqNumber: 'RFQ-2026-003',
    vendorId: 'v3',
    vendorName: 'Initech LLC',
    amount: 12800,
    status: 'approved',
    createdAt: '2026-06-05',
    items: [
      { description: 'Cloud Architect Consultation', quantity: 80, unit: 'hours', unitPrice: 160, total: 12800 }
    ]
  }
];

const DEFAULT_INVOICES = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-001',
    poNumber: 'PO-2026-001',
    vendorId: 'v3',
    vendorName: 'Initech LLC',
    amount: 12800,
    status: 'pending',
    createdAt: '2026-06-06',
    dueDate: '2026-07-06',
    items: [
      { description: 'Cloud Architect Consultation', quantity: 80, unit: 'hours', unitPrice: 160, total: 12800 }
    ]
  }
];

const DEFAULT_LOGS = [
  { id: 'log-1', action: 'User logged in', user: 'admin@vendorbridge.com', role: 'ADMIN', timestamp: '2026-06-06T09:30:00Z' },
  { id: 'log-2', action: 'Created RFQ-2026-001', user: 'Sarah Jenkins', role: 'PROCUREMENT_OFFICER', timestamp: '2026-06-06T09:45:00Z' }
];

function simulateBackend(config) {
  // Extract relative path from config.url (handling base URL)
  let path = config.url.replace(API_BASE_URL, '').split('?')[0];
  if (path.startsWith('/')) path = path.slice(1);
  const method = config.method.toLowerCase();
  const data = config.data ? JSON.parse(config.data) : {};

  // Init storage
  const vendors = getStored('vb_mock_vendors', DEFAULT_VENDORS);
  const rfqs = getStored('vb_mock_rfqs', DEFAULT_RFQS);
  const quotations = getStored('vb_mock_quotations', DEFAULT_QUOTATIONS);
  const approvals = getStored('vb_mock_approvals', DEFAULT_APPROVALS);
  const pos = getStored('vb_mock_pos', DEFAULT_POS);
  const invoices = getStored('vb_mock_invoices', DEFAULT_INVOICES);
  const logs = getStored('vb_mock_logs', DEFAULT_LOGS);

  const resolve = (status, payload) => {
    return Promise.resolve({
      status,
      data: payload,
      headers: {},
      config,
    });
  };

  const reject = (status, message) => {
    return Promise.reject({
      response: {
        status,
        data: { message: message || 'An error occurred' },
      },
    });
  };

  // Log activity helper
  const addLog = (action, email, role) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      user: email || 'system@vendorbridge.com',
      role: role || 'SYSTEM',
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    setStored('vb_mock_logs', logs);
  };

  // ROUTER SIMULATION
  // 1. Auth Routing
  if (path === 'auth/login') {
    const { email, password } = data;
    let mockUser = null;
    let mockToken = '';

    if (email === 'admin@vendorbridge.com' && password === 'admin123') {
      mockUser = { name: 'System Admin', email, role: 'ADMIN' };
      mockToken = 'mock-token-admin';
    } else if (email === 'procurement@vendorbridge.com' && password === 'procurement123') {
      mockUser = { name: 'Sarah Jenkins', email, role: 'PROCUREMENT_OFFICER' };
      mockToken = 'mock-token-procurement';
    } else if (email === 'vendor@vendorbridge.com' && password === 'vendor123') {
      mockUser = { name: 'Acme Corp Admin', email, role: 'VENDOR' };
      mockToken = 'mock-token-vendor';
    } else if (email === 'manager@vendorbridge.com' && password === 'manager123') {
      mockUser = { name: 'Robert Vance', email, role: 'MANAGER' };
      mockToken = 'mock-token-manager';
    }

    if (mockUser) {
      addLog('User logged in', mockUser.email, mockUser.role);
      return resolve(200, { user: mockUser, token: mockToken });
    }
    return reject(400, 'Invalid email or password');
  }

  if (path === 'auth/register') {
    addLog(`New user registered: ${data.email} as ${data.role}`, data.email, data.role);
    return resolve(200, { message: 'User registered successfully' });
  }

  // 2. Overview Report
  if (path === 'reports/overview') {
    const openRfqs = rfqs.filter(r => r.status === 'open').length;
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    const activeVendors = vendors.filter(v => v.status === 'active').length;
    const monthlyInvoices = invoices.length; // simplified count
    return resolve(200, {
      rfqCount: openRfqs,
      pendingApprovalsCount: pendingApprovals,
      vendorsCount: activeVendors,
      invoicesThisMonth: monthlyInvoices,
    });
  }

  // 3. RFQs Routing
  if (path === 'rfqs') {
    if (method === 'get') {
      return resolve(200, rfqs);
    }
    if (method === 'post') {
      const newRfq = {
        ...data,
        id: `rfq-${Date.now()}`,
        rfqNumber: `RFQ-2026-${String(rfqs.length + 1).padStart(3, '0')}`,
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
      };
      rfqs.unshift(newRfq);
      setStored('vb_mock_rfqs', rfqs);
      addLog(`Created RFQ ${newRfq.rfqNumber}`, 'Current User', 'PROCUREMENT_OFFICER');
      return resolve(201, newRfq);
    }
  }

  if (path.startsWith('rfqs/')) {
    const rfqId = path.split('/')[1];
    const rfq = rfqs.find(r => r.id === rfqId);
    if (rfq) {
      return resolve(200, rfq);
    }
    return reject(404, 'RFQ not found');
  }

  // 4. Vendors Routing
  if (path === 'vendors') {
    if (method === 'get') {
      return resolve(200, vendors);
    }
    if (method === 'post') {
      const newVendor = {
        ...data,
        id: `v${Date.now()}`,
        rating: 5.0,
        status: 'active',
      };
      vendors.unshift(newVendor);
      setStored('vb_mock_vendors', vendors);
      addLog(`Onboarded Vendor ${newVendor.name}`, 'Current User', 'PROCUREMENT_OFFICER');
      return resolve(201, newVendor);
    }
  }

  if (path.startsWith('vendors/')) {
    const vendorId = path.split('/')[1];
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      if (method === 'put') {
        const updatedVendors = vendors.map(v => v.id === vendorId ? { ...v, ...data } : v);
        setStored('vb_mock_vendors', updatedVendors);
        return resolve(200, { ...vendor, ...data });
      }
      return resolve(200, vendor);
    }
    return reject(404, 'Vendor not found');
  }

  // 5. Quotations Routing
  if (path === 'quotations') {
    if (method === 'get') {
      return resolve(200, quotations);
    }
    if (method === 'post') {
      const newQuotation = {
        ...data,
        id: `q-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      quotations.unshift(newQuotation);
      setStored('vb_mock_quotations', quotations);
      addLog(`Submitted Quotation for RFQ ${newQuotation.rfqNumber}`, newQuotation.vendorName, 'VENDOR');
      return resolve(201, newQuotation);
    }
  }

  if (path.startsWith('quotations/rfq/')) {
    const rfqId = path.split('/')[2];
    const rfqQuotes = quotations.filter(q => q.rfqId === rfqId);
    return resolve(200, rfqQuotes);
  }

  // Award Quotation & Trigger Approval Workflow
  if (path.startsWith('quotations/award/')) {
    const quoteId = path.split('/')[2];
    const quoteIndex = quotations.findIndex(q => q.id === quoteId);
    if (quoteIndex > -1) {
      const quote = quotations[quoteId]; // wait, indices are used here. Let's find by ID
      const targetQuote = quotations.find(q => q.id === quoteId);
      targetQuote.status = 'awarded';
      
      // Update RFQ status to 'closed' or 'awarded'
      const rfqIndex = rfqs.findIndex(r => r.id === targetQuote.rfqId);
      if (rfqIndex > -1) {
        rfqs[rfqIndex].status = 'awarded';
      }
      
      // Generate Approval Request
      const newApproval = {
        id: `app-${Date.now()}`,
        title: `Award ${targetQuote.rfqNumber}: ${targetQuote.vendorName}`,
        rfqId: targetQuote.rfqId,
        rfqNumber: targetQuote.rfqNumber,
        vendorId: targetQuote.vendorId,
        vendorName: targetQuote.vendorName,
        amount: targetQuote.totalAmount,
        requestedBy: 'Sarah Jenkins',
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        notes: targetQuote.notes,
        quoteId: targetQuote.id
      };
      
      approvals.unshift(newApproval);
      
      setStored('vb_mock_quotations', quotations);
      setStored('vb_mock_rfqs', rfqs);
      setStored('vb_mock_approvals', approvals);
      
      addLog(`Awarded RFQ ${targetQuote.rfqNumber} to ${targetQuote.vendorName}. Awaiting approval.`, 'Sarah Jenkins', 'PROCUREMENT_OFFICER');
      return resolve(200, { message: 'Quotation awarded. Approval request sent.', approval: newApproval });
    }
    return reject(404, 'Quotation not found');
  }

  // 6. Approvals Routing
  if (path === 'approvals') {
    return resolve(200, approvals);
  }

  if (path.startsWith('approvals/')) {
    const approvalId = path.split('/')[1];
    const action = path.split('/')[2]; // e.g., approvals/:id/approve or approvals/:id/reject
    const approvalIndex = approvals.findIndex(a => a.id === approvalId);

    if (approvalIndex > -1) {
      const approval = approvals[approvalIndex];
      
      if (action === 'approve') {
        approval.status = 'approved';
        
        // Auto-generate Purchase Order
        const rfq = rfqs.find(r => r.id === approval.rfqId);
        const newPo = {
          id: `po-${Date.now()}`,
          poNumber: `PO-2026-${String(pos.length + 1).padStart(3, '0')}`,
          rfqId: approval.rfqId,
          rfqNumber: approval.rfqNumber,
          vendorId: approval.vendorId,
          vendorName: approval.vendorName,
          amount: approval.amount,
          status: 'approved',
          createdAt: new Date().toISOString().split('T')[0],
          items: rfq ? rfq.items : [{ description: 'Procurement Items', quantity: 1, unit: 'lot', unitPrice: approval.amount, total: approval.amount }]
        };
        
        pos.unshift(newPo);
        setStored('vb_mock_pos', pos);
        addLog(`Approved PO ${newPo.poNumber} for ${newPo.vendorName}`, 'Robert Vance', 'MANAGER');
      } else if (action === 'reject') {
        approval.status = 'rejected';
        addLog(`Rejected Award Request for ${approval.rfqNumber}`, 'Robert Vance', 'MANAGER');
      }
      
      setStored('vb_mock_approvals', approvals);
      return resolve(200, approval);
    }
  }

  // 7. Purchase Orders Routing
  if (path === 'purchase-orders') {
    return resolve(200, pos);
  }

  if (path.startsWith('purchase-orders/')) {
    const poId = path.split('/')[1];
    const po = pos.find(p => p.id === poId);
    if (po) {
      return resolve(200, po);
    }
    return reject(404, 'PO not found');
  }

  // Create Invoice from PO
  if (path.startsWith('invoices/generate-from-po/')) {
    const poId = path.split('/')[2];
    const po = pos.find(p => p.id === poId);
    if (po) {
      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
        poNumber: po.poNumber,
        vendorId: po.vendorId,
        vendorName: po.vendorName,
        amount: po.amount,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days due
        items: po.items
      };
      invoices.unshift(newInvoice);
      setStored('vb_mock_invoices', invoices);
      addLog(`Generated Invoice ${newInvoice.invoiceNumber} from PO ${po.poNumber}`, 'Sarah Jenkins', 'PROCUREMENT_OFFICER');
      return resolve(201, newInvoice);
    }
    return reject(404, 'PO not found');
  }

  // 8. Invoices Routing
  if (path === 'invoices') {
    return resolve(200, invoices);
  }

  if (path.startsWith('invoices/')) {
    const invId = path.split('/')[1];
    const invoice = invoices.find(i => i.id === invId);
    if (invoice) {
      return resolve(200, invoice);
    }
    return reject(404, 'Invoice not found');
  }

  // 9. Activity Logs
  if (path === 'activity-logs' || path === 'activity') {
    return resolve(200, logs);
  }

  return reject(404, 'Not Found');
}

export default instance;
export { instance as axios };
