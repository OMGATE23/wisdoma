import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useAuthContext } from "./utils/hooks";
import Home from "./pages/home/Home";
import SignUp from "./pages/signup/SignUp";
import Notes from "./pages/notes/Notes";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <>loading...</>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "signup",
      element: user ? <Navigate to="/folder" replace /> : <SignUp />,
    },
    {
      path: "folder",
      element: user ? <Dashboard /> : <Navigate to="/signup" replace />,
    },
    {
      path: "folder/:id",
      element: user ? <Dashboard /> : <Navigate to="/signup" replace />,
    },
    {
      path: "note/:id",
      element: <Notes />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
