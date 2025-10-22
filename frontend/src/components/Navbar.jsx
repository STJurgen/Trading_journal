import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow-sm dark:bg-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
          <img src={logo} alt="Trading Journal" className="h-9 w-9" />
          Trading Journal
        </Link>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          {isLoading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 dark:text-slate-200 sm:inline">{user.name}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
