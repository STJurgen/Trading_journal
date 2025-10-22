import { useEffect, useState } from 'react';

const defaultValues = {
  asset: '',
  direction: 'long',
  quantity: '',
  entryPrice: '',
  exitPrice: '',
  strategyId: '',
  openedAt: '',
  closedAt: '',
  notes: ''
};

const toInputDateTime = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

const TradeForm = ({ initialValues, onSubmit, onCancel }) => {
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (initialValues) {
      setValues({
        ...defaultValues,
        ...initialValues,
        openedAt: toInputDateTime(initialValues.openedAt),
        closedAt: toInputDateTime(initialValues.closedAt)
      });
    } else {
      setValues(defaultValues);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      asset: values.asset,
      direction: values.direction,
      quantity: Number(values.quantity),
      entryPrice: Number(values.entryPrice),
      exitPrice: values.exitPrice === '' ? null : Number(values.exitPrice),
      strategyId: values.strategyId ? Number(values.strategyId) : null,
      openedAt: values.openedAt || null,
      closedAt: values.closedAt || null,
      notes: values.notes || null
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-800">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Asset
          <input
            type="text"
            name="asset"
            value={values.asset}
            onChange={handleChange}
            required
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Direction
          <select
            name="direction"
            value={values.direction}
            onChange={handleChange}
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Quantity
          <input
            type="number"
            name="quantity"
            value={values.quantity}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Entry Price
          <input
            type="number"
            name="entryPrice"
            value={values.entryPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Exit Price
          <input
            type="number"
            name="exitPrice"
            value={values.exitPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Strategy ID
          <input
            type="text"
            name="strategyId"
            value={values.strategyId}
            onChange={handleChange}
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Opened At
          <input
            type="datetime-local"
            name="openedAt"
            value={values.openedAt || ''}
            onChange={handleChange}
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
          Closed At
          <input
            type="datetime-local"
            name="closedAt"
            value={values.closedAt || ''}
            onChange={handleChange}
            className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
      </div>
      <label className="flex flex-col text-sm font-medium text-slate-600 dark:text-slate-200">
        Notes
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          rows={4}
          className="mt-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          {initialValues ? 'Update Trade' : 'Add Trade'}
        </button>
      </div>
    </form>
  );
};

export default TradeForm;
