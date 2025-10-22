import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/trades', label: 'Trades' },
  { to: '/strategies', label: 'Strategies' },
  { to: '/profile', label: 'Profile' }
];

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:block">
      <nav className="space-y-1 px-4 py-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`
            }
            end={link.to === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
