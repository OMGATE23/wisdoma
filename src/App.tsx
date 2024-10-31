import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { useAuthContext } from './utils/hooks';
import Home from './pages/home/Home';
import SignUp from './pages/signup/SignUp';
import Notes from './pages/notes/Notes';
import Dashboard from './pages/dashboard/Dashboard';
import Graph from './pages/graph/Graph';
import Login from './pages/login/Login';

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="font-lora flex justify-center items-center h-[100vh]">
        Good things come to those who wait...
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: 'signup',
      element: user ? <Navigate to="/folder" replace /> : <SignUp />,
    },
    {
      path: 'login',
      element: user ? <Navigate to="/folder" replace /> : <Login />,
    },
    {
      path: 'folder',
      element: user ? <Dashboard /> : <Navigate to="/signup" replace />,
    },
    {
      path: 'folder/:id',
      element: user ? <Dashboard /> : <Navigate to="/signup" replace />,
    },
    {
      path: 'note/:id',
      element: <Notes />,
    },
    {
      path: 'visualize',
      element: user ? <Graph /> : <Navigate to="/signup" replace />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
