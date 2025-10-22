import { useState } from 'react';
import TradeForm from '../components/TradeForm';
import TradeTable from '../components/TradeTable';
import useFetch from '../hooks/useFetch';
import { createTrade, deleteTrade, getTrades, updateTrade } from '../services/tradeService';

const Trades = () => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const {
    data: trades,
    isLoading,
    refetch
  } = useFetch(getTrades, { immediate: true, dependencies: [] });

  const handleSubmit = async (payload) => {
    if (selectedTrade) {
      await updateTrade(selectedTrade.id, payload);
    } else {
      await createTrade(payload);
    }
    setSelectedTrade(null);
    await refetch();
  };

  const handleDelete = async (trade) => {
    await deleteTrade(trade.id);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Trades</h1>
        <p className="text-sm text-slate-500">Record, edit and analyze your trading activity.</p>
      </header>

      <TradeForm
        initialValues={selectedTrade}
        onSubmit={handleSubmit}
        onCancel={() => setSelectedTrade(null)}
      />

      <TradeTable
        trades={trades ?? []}
        isLoading={isLoading}
        onEdit={setSelectedTrade}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Trades;
