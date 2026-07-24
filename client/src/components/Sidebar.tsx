import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-5 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">LeadFlow CRM</h1>

      <nav className="space-y-4 flex-1">
        <Link className="block hover:text-blue-400" to="/dashboard">
          Dashboard
        </Link>
        <Link className="block hover:text-blue-400" to="/leads">
          Leads
        </Link>
        <Link className="block hover:text-blue-400" to="/users">
          Users
        </Link>
        <Link className="block hover:text-blue-400" to="/profile">
          Profile
        </Link>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto w-full text-left text-red-400 hover:text-red-300 py-2 border-t border-gray-700 pt-4"
      >
        Logout
      </button>
    </aside>
  );
}