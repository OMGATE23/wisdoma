import { Link } from "react-router-dom";
import HeroGraph from "../../components/home/HeroGraph";

export default function Home() {
  return (
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
  );
}
