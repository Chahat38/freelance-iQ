import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Mail, DollarSign, Globe, Trash2 } from 'lucide-react';
import { ClientRecord } from '../../types';

export const ClientCrmModule: React.FC = () => {
  const { clients, addClient, deleteClient, showToast } = useApp();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<'Upwork' | 'Fiverr' | 'Direct Client' | 'LinkedIn'>('Upwork');
  const [country, setCountry] = useState('United States');
  const [totalBilled, setTotalBilled] = useState(1200);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Client name is required', 'error');
      return;
    }

    const newClient: ClientRecord = {
      id: 'cli_' + Date.now(),
      name,
      company: company || 'Independent',
      email: email || 'client@example.com',
      platform,
      status: 'Active',
      totalBilled: Number(totalBilled) || 0,
      country,
      notes: 'Acquired via ' + platform,
      lastContacted: new Date().toLocaleDateString(),
    };

    addClient(newClient);
    setName('');
    setCompany('');
    setEmail('');
    showToast('Client added to CRM!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Client CRM & Revenue Tracker</h1>
          <p className="text-xs text-slate-400">
            Manage your client contact relationships, total earnings per client, and status history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form onSubmit={handleAdd} className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" /> Add Client
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Client Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Company / Brand</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. TechFlow Labs"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@techflow.io"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr</option>
                <option value="Direct Client">Direct Client</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Billed ($)</label>
              <input
                type="number"
                value={totalBilled}
                onChange={(e) => setTotalBilled(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-2xl transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Save Client Record
          </button>
        </form>

        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">
            Client Directory ({clients.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
            {clients.map((client) => (
              <div
                key={client.id}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{client.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                      ${client.totalBilled.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{client.company} • {client.platform}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </span>
                  <button
                    onClick={() => deleteClient(client.id)}
                    className="p-1 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
