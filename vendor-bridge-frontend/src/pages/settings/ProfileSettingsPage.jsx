import React, { useState } from 'react';
import { User, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import useAuth from '../../hooks/useAuth';

export function ProfileSettingsPage() {
  const { user, token, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    const updatedUser = { ...user, name: form.name.trim(), email: form.email.trim(), role: form.role };
    login(updatedUser, token);
    toast.success('Profile settings saved.');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Profile Settings" subtitle="Manage your local VendorBridge account display details.">
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0A0F1E] p-4">
            <div className="h-12 w-12 rounded-xl bg-[#6366F1] flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white">{form.name || 'User'}</p>
              <p className="text-xs text-[#9CA3AF]">{form.role.replaceAll('_', ' ')}</p>
            </div>
          </div>

          <Input
            label="Display Name"
            name="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <Input label="Role" name="role" value={form.role.replaceAll('_', ' ')} disabled />

          <div className="flex justify-end">
            <Button type="submit" icon={Save}>Save Profile</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfileSettingsPage;
