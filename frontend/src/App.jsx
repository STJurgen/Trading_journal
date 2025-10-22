import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Loader from './components/Loader';
import AppRouter from './router';
import { useAuth } from './hooks/useAuth';

const App = () => {
  const { isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex-1">
          {isLoading ? <Loader /> : <AppRouter />}
        </main>
      </div>
    </div>
  );
};

export default App;
