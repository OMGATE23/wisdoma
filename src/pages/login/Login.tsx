import { useState } from 'react';
import { useAuthContext } from '../../utils/hooks';
import { toast } from 'sonner';
import { Link, redirect } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loading: userLoading } = useAuthContext();
  async function logInUser() {
    setLoading(true);
    const resp = await login(email, password);
    if (resp.error) {
      toast.error(resp.message);
    } else {
      redirect('/folder');
    }
    setLoading(false);
  }

  if (userLoading) {
    return <></>;
  }
  return (
    <div className="h-[90vh] md:h-[70vh] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4 w-80 md:w-96 md:h-[60%] p-4 rounded outline outline-neutral-200">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-[600] font-lora mb-1">Login</h1>
          <p className="font-lora text-neutral-700">
            Login to write the best notes on can write
          </p>
        </div>
        <input
          className="w-full py-2 px-4 rounded outline outline-1 outline-neutral-200"
          value={email}
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="w-full py-2 px-4 rounded outline outline-1 outline-neutral-200"
          value={password}
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
          type="password"
        />

        <button
          disabled={loading}
          className="w-full py-2 px-4 rounded font-lora text-md bg-neutral-900 hover:bg-black transition-colors duration-100 disabled: text-white"
          onClick={() => logInUser()}
        >
          Login
        </button>
        <p className="font-lora text-neutral-600 text-sm">
          Don't have an account?{' '}
          <Link className="font-lora text-black" to="/signup">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
