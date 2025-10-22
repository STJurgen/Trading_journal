import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { createStrategy, deleteStrategy, getStrategies, updateStrategy } from '../services/strategyService';

const emptyForm = { name: '', description: '', timeframe: '' };

const Strategies = () => {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const {
    data: strategies,
    isLoading,
    refetch
  } = useFetch(getStrategies, { immediate: true, dependencies: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await updateStrategy(editingId, form);
    } else {
      await createStrategy(form);
    }
    setEditingId(null);
    setForm(emptyForm);
    await refetch();
  };

  const handleEdit = (strategy) => {
    setEditingId(strategy.id);
    setForm({ name: strategy.name, description: strategy.description || '', timeframe: strategy.timeframe || '' });
  };

  const handleDelete = async (strategy) => {
    await deleteStrategy(strategy.id);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Strategies</h1>
        <p className="text-sm text-slate-500">Document the playbooks that guide your decision making.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
            Timeframe
            <input
              type="text"
              name="timeframe"
              value={form.timeframe}
              onChange={handleChange}
              placeholder="1H, 4H, Daily..."
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200 md:col-span-3">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
        </div>
        <div className="flex items-center justify-end gap-3">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {editingId ? 'Update Strategy' : 'Add Strategy'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-slate-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              {['Name', 'Timeframe', 'Description', ''].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={4}>
                  Loading strategies...
                </td>
              </tr>
            )}
            {!isLoading && (!strategies || !strategies.length) && (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={4}>
                  No strategies documented yet.
                </td>
              </tr>
            )}
            {strategies?.map((strategy) => (
              <tr key={strategy.id} className="text-sm text-slate-600 dark:text-slate-200">
                <td className="px-4 py-3 font-medium">{strategy.name}</td>
                <td className="px-4 py-3">{strategy.timeframe || '-'}</td>
                <td className="px-4 py-3">{strategy.description || '-'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(strategy)}
                      className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(strategy)}
                      className="rounded-md border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-400/40 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Strategies;
