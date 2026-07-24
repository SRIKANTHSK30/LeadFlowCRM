import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchLeadDetails = async () => {
      try {
        // Get all leads and find the one with matching id
        const response = await api.leads.getAll();
        const found = response.data?.find((l: any) => l.id === id);
        if (found) {
          setLead(found);
          setStatus(found.status);
        }
        
        // Fetch notes
        const notesData = await api.leads.getNotes(id!);
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching lead details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeadDetails();
  }, [id]);

  const handleUpdateStatus = async () => {
    try {
      await api.leads.update(id!, { status });
      setLead({ ...lead, status });
      alert('Status updated!');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    
    try {
      await api.leads.addNote(id!, newNote);
      const updatedNotes = await api.leads.getNotes(id!);
      setNotes(updatedNotes);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.leads.delete(id!);
      navigate('/leads');
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!lead) return <div className="p-6">Lead not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{lead.name}</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/leads')}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Lead Information</h3>
          <p><span className="text-gray-500">Email:</span> {lead.email}</p>
          <p><span className="text-gray-500">Phone:</span> {lead.phone || 'N/A'}</p>
          <p><span className="text-gray-500">Created:</span> {new Date(lead.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Status</h3>
          <div className="flex gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="flex-1 p-2 border rounded"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Notes</h3>
        <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add a note..."
            className="flex-1 p-2 border rounded"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Note
          </button>
        </form>
        
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet</p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note: any) => (
              <li key={note.id} className="border-l-4 border-blue-500 pl-3 py-1">
                <p>{note.content}</p>
                <p className="text-sm text-gray-500">
                  {note.user?.name} • {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}