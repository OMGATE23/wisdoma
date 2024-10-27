import { useState } from "react";
import { useAuthContext } from "../../utils/hooks";
import { Link, redirect } from "react-router-dom";
import { toast } from "sonner";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, loading } = useAuthContext();

  async function signUpUser() {
    const resp = await signup(email, password, name);
    redirect("/folder");
    if (resp.error) {
      toast.error(resp.message);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <div className=" h-[70vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 w-96 min-h-[60%] p-4 rounded outline outline-neutral-200">
          <div className="text-center mb-2">
            <h1 className="text-3xl font-[600] font-lora mb-1">Sign up</h1>
            <p className="font-lora text-neutral-700 text-sm">
              Start your wonderful journey with Wisdom!
            </p>
          </div>
          <input
            className="w-full py-2 px-4 rounded outline outline-1 outline-neutral-200"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="w-full py-2 px-4 rounded outline outline-1 outline-neutral-200"
            value={name}
            placeholder="name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full py-2 px-4 rounded outline outline-1 outline-neutral-200"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button
            className="w-full py-2 px-4 rounded font-lora text-md bg-neutral-900 hover:bg-black transition-colors duration-100 disabled: text-white"
            onClick={() => signUpUser()}
          >
            Sign up
          </button>
          <p className="font-lora text-neutral-600 text-sm">
            Already have an account?{" "}
            <Link className="font-lora text-black" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignUp;
