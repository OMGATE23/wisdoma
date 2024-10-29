import { Link } from "react-router-dom";
import HeroGraph from "../../components/home/HeroGraph";

export default function Home() {
  return (
    <div>
      <div
        className="py-4 px-8 flex justify-end items-center gap-4"
      >
        <Link
          className="font-lora py-1.5 px-4 rounded shadow-sm text-sm outline outline-1 outline-neutral-700 text-white bg-neutral-900"
          to='/signup'
        >
          Sign up
        </Link>
        <Link
          className="font-lora py-1.5 px-4 rounded shadow-sm text-sm outline outline-1 outline-neutral-700 "
          to='login'
        >
          Login
        </Link>
      </div>
      <div className="flex items-center">
      <div className="min-h-[60vh] flex flex-col px-32 justify-center">
        <h1 className="font-lora text-6xl font-[600]">Wisdoma</h1>
        <h2 className="font-lora text-xl font-[600] text-neutral-700">
          The best note taking app of{" "}
          <span className="text-neutral-900 font-lora">21st century</span>
        </h2>
        <h3 className="text-neutral-500 font-lora mt-4 w-[50%]">
          Transform your thoughts into organized masterpieces. Experience
          note-taking reimagined for the modern age.
        </h3>
        <Link
          to="/signup"
          className="font-lora py-2 px-6 rounded bg-neutral-900 text-white w-fit text-sm mt-8 hover:bg-black"
        >
          Get Started
        </Link>
      </div>
      <HeroGraph />
    </div>
    </div>
  );
}
