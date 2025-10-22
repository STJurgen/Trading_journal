import StatsCard from '../components/StatsCard';
import TradeTable from '../components/TradeTable';
import useFetch from '../hooks/useFetch';
import { getTrades } from '../services/tradeService';
import { getStats } from '../services/userService';

const Dashboard = () => {
  const {
    data: stats,
    isLoading: statsLoading
  } = useFetch(getStats, { immediate: true, dependencies: [] });

  const {
    data: trades,
    isLoading: tradesLoading
  } = useFetch(getTrades, { immediate: true, dependencies: [] });

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor your performance and review recent activity.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Trades" value={statsLoading ? '...' : stats?.totalTrades ?? 0} icon="📈" />
        <StatsCard title="Total PnL" value={statsLoading ? '...' : `${stats?.totalPnL ?? 0}`} icon="💰" />
        <StatsCard title="Win Rate" value={statsLoading ? '...' : `${stats?.winRate ?? 0}%`} icon="🏆" />
        <StatsCard
          title="Win / Loss"
          value={statsLoading ? '...' : `${stats?.winCount ?? 0} / ${stats?.lossCount ?? 0}`}
          icon="⚖️"
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent Trades</h2>
          <p className="text-sm text-slate-500">Latest activity from your journal.</p>
        </div>
        <TradeTable trades={trades ?? []} isLoading={tradesLoading} />
      </section>
    </div>
  );
};

export default Dashboard;
