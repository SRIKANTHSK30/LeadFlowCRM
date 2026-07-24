import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', status: 'new' });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (search) params.search = search;
      if (status) params.status = status;
      
      const response = await api.leads.getAll(params);
      setLeads(response.data || []);
      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, search, status]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.leads.create(form);
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', status: 'new' });
      fetchLeads();
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.leads.delete(id);
      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Lead'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search leads..."
          className="p-2 border rounded flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              className="p-2 border rounded"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <select
              className="p-2 border rounded"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button type="submit" className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Lead
          </button>
        </form>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">No leads found</td>
              </tr>
            ) : (
              leads.map((lead: any) => (
                <tr key={lead.id} className="border-t hover:bg-gray-50 cursor-pointer">
                  <td 
                    className="p-3 text-blue-600 hover:underline"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  >
                    {lead.name}
                  </td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                      lead.status === 'proposal' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(lead.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}