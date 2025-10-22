import { Navigate, useRoutes } from 'react-router-dom';
import Loader from './components/Loader';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Strategies from './pages/Strategies';
import Trades from './pages/Trades';
import { useAuth } from './hooks/useAuth';

const AppRouter = () => {
  const { user, isLoading } = useAuth();

  const routes = useRoutes([
    { path: '/', element: user ? <Dashboard /> : <Navigate to="/login" replace /> },
    { path: '/trades', element: user ? <Trades /> : <Navigate to="/login" replace /> },
    { path: '/strategies', element: user ? <Strategies /> : <Navigate to="/login" replace /> },
    { path: '/profile', element: user ? <Profile /> : <Navigate to="/login" replace /> },
    { path: '/login', element: user ? <Navigate to="/" replace /> : <Login /> },
    { path: '/register', element: user ? <Navigate to="/" replace /> : <Register /> },
    { path: '*', element: <Navigate to={user ? '/' : '/login'} replace /> }
  ]);

  if (isLoading) {
    return <Loader />;
  }

  return routes;
};

export default AppRouter;
