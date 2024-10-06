import { Link, redirect } from "react-router-dom"
import { useAuthContext } from "../../utils/hooks"


export default function Dashboard() {

  const {user, logout} = useAuthContext()

  if(!user) {
    redirect('/signup')
  }
  return (
    <div>
      Hello {user!.name}

      <Link to='/notes/3452'>Note 3452</Link>

      <button onClick={logout}>Logout</button>
    </div>
  )
}
