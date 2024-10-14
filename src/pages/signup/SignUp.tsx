import { useState } from "react";
import { useAuthContext } from "../../utils/hooks";
import { redirect } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, signup, login, logout, loading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  async function signUpUser() {
    const resp = await signup(email, password, name);
    redirect("/folder");
    if (resp.error) {
      setError(resp.message);
    } else {
      setError(null);
    }
  }

  async function logInUser() {
    const resp = await login(email, password);
    redirect("/folder");
    if (resp.error) {
      setError(resp.message);
    } else {
      setError(null);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
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
    );
  }
  return (
    <>
      <div className="flex flex-col items-center gap-4 mb-8">
        <h1>Sign Up</h1>
        <input
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          value={name}
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button
          className="px-4 py-1 outline outline-1 rounded"
          onClick={() => signUpUser()}
        >
          Sign up
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1>Login</h1>
        <input
          value={email}
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <button
          className="px-4 py-1 outline outline-1 rounded"
          onClick={() => logInUser()}
        >
          Login
        </button>
      </div>

      {error && <p>{error}</p>}
    </>
  );
}

export default SignUp;
