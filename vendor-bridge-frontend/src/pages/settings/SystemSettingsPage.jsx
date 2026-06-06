import React, { useEffect, useState } from 'react';
import { Save, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';

const DEFAULT_SETTINGS = {
  companyName: 'VendorBridge ERP',
  approvalLimit: '50000',
  taxRate: '18',
  notificationEmail: 'procurement@vendorbridge.com',
};

export function SystemSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem('vb_system_settings');
    if (stored) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    }
  }, []);

  const updateField = (field, value) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem('vb_system_settings', JSON.stringify(settings));
    toast.success('System settings saved.');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="System Settings" subtitle="Configure demo procurement defaults used by this workspace.">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="rounded-xl border border-white/10 bg-[#0A0F1E] p-4 flex items-center gap-3">
            <Settings className="h-5 w-5 text-[#818CF8]" />
            <p className="text-sm text-[#CBD5E1]">These settings are stored locally for the hackathon demo session.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              name="companyName"
              value={settings.companyName}
              onChange={(event) => updateField('companyName', event.target.value)}
            />
            <Input
              label="Notification Email"
              name="notificationEmail"
              type="email"
              value={settings.notificationEmail}
              onChange={(event) => updateField('notificationEmail', event.target.value)}
            />
            <Input
              label="Default GST Rate (%)"
              name="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(event) => updateField('taxRate', event.target.value)}
            />
            <Input
              label="Approval Limit"
              name="approvalLimit"
              type="number"
              value={settings.approvalLimit}
              onChange={(event) => updateField('approvalLimit', event.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" icon={Save}>Save Settings</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default SystemSettingsPage;
