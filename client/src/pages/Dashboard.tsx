import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0 });
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.leads.getAll({ limit: 5 });
        setRecentLeads(response.data || []);
        
        const all = await api.leads.getAll();
        const data = all.data || [];
        setStats({
          total: data.length,
          new: data.filter((l: any) => l.status === 'new').length,
          contacted: data.filter((l: any) => l.status === 'contacted').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Total Leads</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">New</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Contacted</h3>
          <p className="text-2xl font-bold text-green-600">{stats.contacted}</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Recent Leads</h2>
        {recentLeads.length === 0 ? (
          <p className="text-gray-500">No leads yet</p>
        ) : (
          <ul className="divide-y">
            {recentLeads.map((lead: any) => (
              <li key={lead.id} className="py-2">
                <p className="font-medium">{lead.name}</p>
                <p className="text-sm text-gray-500">{lead.email} • {lead.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}