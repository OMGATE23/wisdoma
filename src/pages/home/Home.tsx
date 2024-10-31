import { Link } from 'react-router-dom';
import ArrowRightIcon from '../../icons/ArrowRightIcon';

export default function Home() {
  return (
    <div>
      <div className="py-4 px-8 flex justify-end items-center gap-4">
        <Link
          className="font-lora py-1.5 px-4 rounded shadow-sm text-sm outline outline-1 outline-neutral-700 text-white bg-neutral-900"
          to="/signup"
        >
          Sign up
        </Link>
        <Link
          className="font-lora py-1.5 px-4 rounded shadow-sm text-sm outline outline-1 outline-neutral-700 "
          to="login"
        >
          Login
        </Link>
      </div>
      <div className="flex items-center px-12 gap-8 justify-center">
        <div className="min-h-[60vh] w=[80%] md:w-[50%] flex flex-col justify-center items-center text-center">
          <h1 className="font-lora text-6xl font-[600]">Wisdoma</h1>
          <h2 className="font-lora text-xl font-[600] text-neutral-700">
            The best note taking app of{' '}
            <span className="text-neutral-900 font-lora">21st century</span>
          </h2>
          <h3 className="text-neutral-500 font-lora mt-4">
            Transform your thoughts into organized masterpieces. Experience
            note-taking reimagined for the modern age.
          </h3>
          <Link
            to="/signup"
            className="flex items-center gap-2 hover:gap-4 transition-all duration-100 py-2 px-6 rounded bg-neutral-900 text-white w-fit text-sm mt-4 hover:bg-black"
          >
            Get Started <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
