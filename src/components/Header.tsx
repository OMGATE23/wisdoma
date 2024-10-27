import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../utils/hooks";

export default function Header() {
  const { logout } = useAuthContext();
  const location = useLocation();
  return (
    <div className="text-neutral-900 border-b border-neutral-200  py-2.5 px-6 flex justify-between items-center mx-auto">
      <div className="text-xl font-[600]">Wisdom</div>

      <div className="flex items-center gap-12">
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
        className="text-sm hover:bg-neutral-50 py-1 px-3 rounded transition-all duration-100"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
