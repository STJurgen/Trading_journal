import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { getProfile, updateProfile } from '../services/userService';

const Profile = () => {
  const { updateUser, logout } = useAuth();
  const {
    data: profile,
    isLoading,
    refetch
  } = useFetch(getProfile, { immediate: true, dependencies: [] });
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name || '', email: profile.email || '' });
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updated = await updateProfile({ name: form.name, email: form.email });
    updateUser(updated);
    await refetch();
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal information and account settings.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
        </div>
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/40 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            Sign out
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
