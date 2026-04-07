import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Settings as SettingsIcon, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [config, setConfig] = useState({
    fine_per_day: '',
    max_books: '',
    return_days: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/settings');
      setConfig(data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await api.post('/settings', config);
      setMsg({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon size={24} className="text-gray-600" /> System Settings
        </h1>
        <button onClick={fetchSettings} className="p-2 hover:bg-gray-100 rounded-full transition" title="Refresh">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {msg && (
        <div className={`flex items-center gap-2 p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      <div className="card p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fine Amount (per day overdue)</label>
              <div className="relative mt-1 border rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  className="input pl-7"
                  value={config.fine_per_day}
                  onChange={(e) => setConfig({ ...config, fine_per_day: e.target.value })}
                  placeholder="5"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">Current rate applied when a book is returned after the due date.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Books per Student</label>
              <input
                type="number"
                className="input"
                value={config.max_books}
                onChange={(e) => setConfig({ ...config, max_books: e.target.value })}
                placeholder="3"
              />
              <p className="mt-2 text-xs text-gray-500 italic">Limits the number of active issues a single student can have.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Return Period (Days)</label>
              <div className="relative mt-1 border rounded-md shadow-sm">
                <input
                  type="number"
                  className="input pr-12"
                  value={config.return_days}
                  onChange={(e) => setConfig({ ...config, return_days: e.target.value })}
                  placeholder="14"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 sm:text-sm">days</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 italic">The standard duration before a book is considered overdue.</p>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 px-6 py-2.5"
            >
              {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
        <AlertCircle size={20} className="shrink-0 text-amber-600" />
        <p><strong>Note:</strong> Changes to settings will apply to future transactions. Fine calculation for currently issued books will use the new rate upon return.</p>
      </div>
    </div>
  );
};

export default Settings;
