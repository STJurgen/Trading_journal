const StatsCard = ({ title, value, icon }) => (
  <div className="rounded-lg bg-white p-5 shadow-sm dark:bg-slate-800">
    <div className="flex items-center gap-4">
      {icon && <span className="text-2xl text-primary">{icon}</span>}
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{value}</p>
      </div>
    </div>
  </div>
);

export default StatsCard;
