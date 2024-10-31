import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../utils/hooks";
import { useState } from "react";

export default function Header() {
  const { logout } = useAuthContext();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="text-neutral-900 border-b border-neutral-200 py-2.5 px-6 flex justify-between items-center mx-auto relative">
      <Link to="/" className="text-xl font-[600] font-lora">
        Wisdoma
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <Link
          className="text-sm border-b border-white hover:border-black"
          to="/folder"
        >
          Your Workspace
        </Link>

        {!location.pathname.includes("visualize") && (
          <Link
            className="text-sm border-b border-white hover:border-black"
            to="/visualize"
          >
            Visualize
          </Link>
        )}
      </div>

      <button
        className="hidden md:block text-sm hover:bg-neutral-50 py-1 px-3 rounded transition-all duration-100"
        onClick={logout}
      >
        Logout
      </button>

      <button
        className="md:hidden text-xl p-2 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {menuOpen && (
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] z-50 bg-white flex flex-col items-center p-6 space-y-4 shadow-md">
          <button
            className="text-2xl self-end mb-4"
            onClick={() => setMenuOpen(false)}
          >
            &times;
          </button>

          <Link
            className="text-lg border-b border-white hover:border-black"
            to="/folder"
            onClick={() => setMenuOpen(false)}
          >
            Your Workspace
          </Link>

          {!location.pathname.includes("visualize") && (
            <Link
              className="text-lg border-b border-white hover:border-black"
              to="/visualize"
              onClick={() => setMenuOpen(false)}
            >
              Visualize
            </Link>
          )}

          <button
            className="text-lg hover:bg-neutral-50 py-1 px-3 rounded transition-all duration-100"
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
