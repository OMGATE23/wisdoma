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
      <div className='flex justify-center px-4 flex-col items-center my-12 gap-16'>
        <div className="flex items-center px-12 justify-center">
          <div className=" w-[80%] md:w-[60%] flex flex-col justify-center items-center text-center">
            <h1 className="font-lora text-6xl font-[600]">Wisdoma</h1>
            <h2 className="font-lora text-xl font-[600] text-neutral-700">
            Visualizing Your Notes through{' '}
              <span className="text-black font-lora">Knowledge Graphs</span>
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
        <div className='w-full md:w-[80%] aspect-video flex flex-col gap-4'>
          <h3 className='text-2xl font-[600] text-center'>Checkout our interactive demo!</h3>
        <iframe 
          style={{border: "none"}} 
          width="100%" 
          height="100%" 
          src="https://app.staging.sharefable.com/embed/demo/dnu-om-wisdoma-cj8wzwe500f6kile" 
          allowFullScreen></iframe>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl md:text-3xl font-[600] text-center">
            Store your notes in an intuitive folder structure
          </h2>
          <img
            className="block w-[75%] md:w-[720px] rounded-md shadow"
            alt="folder image"
            src="/folder.png"
          />
        </div>
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl md:text-3xl font-[600] text-center">
            Write stellar notes with our awesome editor
          </h2>
          <img
            className="block w-[75%] md:w-[720px] rounded-md shadow"
            alt="folder image"
            src="/note.png"
          />
          `
        </div>
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl md:text-3xl font-[600] text-center">
            Visualize your notes like never before
          </h2>
          <img
            className="block w-[75%] md:w-[720px] rounded-md shadow"
            alt="folder image"
            src="/graphview.png"
          />
        </div>
      </div>

      <div className="py-8 px-4 flex items-center justify-center text-center bg-neutral-50 mt-12">
        <div>
          Made my{' '}
          <a className="text-blue-800" href="https://github.com/OMGATE23">
            Om
          </a>{' '}
          and{' '}
          <a className="text-red-600" href="https://appwrite.io/">
            Appwrite
          </a>
        </div>
      </div>
    </div>
  );
}
