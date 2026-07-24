import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.user.profile();
        console.log('Profile data:', data); // Debug log
        setUser(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">Failed to load profile</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <p className="font-medium text-lg">{user.name || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium text-lg">{user.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium text-lg">
              <span className={`px-3 py-1 rounded text-sm ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.role || 'member'}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Joined</label>
            <p className="font-medium text-lg">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}