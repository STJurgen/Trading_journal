const TradeTable = ({ trades = [], onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading trades...</p>;
  }

  if (!trades.length) {
    return <p className="text-sm text-slate-500">No trades recorded yet.</p>;
  }

  const pnlClass = (pnl) => {
    if (pnl > 0) return 'text-emerald-600';
    if (pnl < 0) return 'text-rose-500';
    return 'text-slate-500';
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-900/50">
          <tr>
            {['Asset', 'Direction', 'Quantity', 'Entry', 'Exit', 'PnL', 'Opened', 'Closed', ''].map((header) => (
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
          {trades.map((trade) => (
            <tr key={trade.id} className="text-sm text-slate-600 dark:text-slate-200">
              <td className="px-4 py-3 font-medium">{trade.asset}</td>
              <td className="px-4 py-3 capitalize">{trade.direction}</td>
              <td className="px-4 py-3">{trade.quantity}</td>
              <td className="px-4 py-3">{trade.entryPrice}</td>
              <td className="px-4 py-3">{trade.exitPrice ?? '-'}</td>
              <td className={`px-4 py-3 font-semibold ${pnlClass(trade.pnl)}`}>
                {trade.pnl ?? '-'}
              </td>
              <td className="px-4 py-3">{trade.openedAt ? new Date(trade.openedAt).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-3">{trade.closedAt ? new Date(trade.closedAt).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(trade)}
                    className="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(trade)}
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
  );
};

export default TradeTable;
