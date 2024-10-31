import { Link } from 'react-router-dom';

export default function ErrorComponent() {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center gap-2 text-center">
      <h1 className="text-3xl font-[600]">Oops! Something went wrong</h1>
      <div className="text-neutral-400">
        Don't worry, we are looking in to this
      </div>
      <div className="flex justify-center flex-col md:flex-row items-center gap-2 md:gap-6">
        <Link
          className="border-b border-neutral-300 hover:border-black"
          to="/folder"
        >
          Go to your workspace
        </Link>
        <Link className="border-b border-neutral-300 hover:border-black" to="/">
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
