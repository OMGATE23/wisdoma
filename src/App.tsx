import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { useAuthContext } from "./utils/hooks"
import Home from "./pages/home/Home"
import SignUp from "./pages/signup/SignUp"
import Notes from "./pages/notes/Notes"
import Dashboard from "./pages/dashboard/Dashboard"


function App() {
  const {user, loading} = useAuthContext()


  if(loading) {
    return <>loading...</>
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home/>
    },
    {
      path: 'signup',
      element: user ? <Navigate to="/dashboard" replace /> : <SignUp />
    },
    {
      path: 'dashboard',
      element: user ? <Dashboard /> : <Navigate to="/signup" replace />
    },
    {
      path: 'notes/:id',
      element: user ? <Notes /> : <Navigate to="/signup" replace />
    }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
