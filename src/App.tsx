import { useState } from 'react'
import './App.css'
import { useAuthContext } from './utils/hooks';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, signup, login, logout, loading} = useAuthContext();
  const [error, setError] = useState<string | null>(null)

  async function signUpUser() {
    const resp = await signup(email, password, name);

    if(resp.error) {
      setError(resp.message)
    } else {
      setError(null)
    }
  }

  async function logInUser() {
    const resp = await login(email, password);

    if(resp.error) {
      setError(resp.message)
    } else {
      setError(null)
    }
  }

  if(loading) {
    return <p>Loading...</p>
  }
  if (user) {
    return (
      <div>
        <h1>Hello Everyone</h1>
        <p>name: {user.name}</p>
        <p>email: {user.email}</p>
        <p>id : {user.id}</p>
        <button onClick={logout}>Logout</button>
        {error && <p>{error}</p>}
      </div>
    )
  }
  return (
    <>
      <div>
        <h1>Sign Up</h1>
        <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)} type='email'/>
        <input value={name} placeholder='name' onChange={e => setName(e.target.value)}/>
        <input value={password} placeholder='password' onChange={e => setPassword(e.target.value)} type='password'/>

        <button onClick={() => signUpUser()}>Sign up</button>
      </div>

      <div>
        <h1>Login</h1>
        <input value={email} placeholder='email' onChange={e => setEmail(e.target.value)} type='email'/>
        <input value={password} placeholder='password' onChange={e => setPassword(e.target.value)} type='password'/>

        <button onClick={() => logInUser()}>Login</button>
      </div>

      {error && <p>{error}</p>}
    </>
  )
}

export default App
