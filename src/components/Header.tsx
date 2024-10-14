import { useAuthContext } from "../utils/hooks";

export default function Header() {
  const { logout } = useAuthContext();
  return (
    <div className="text-neutral-900 outline outline-1 outline-neutral-200 bg-white py-2.5 px-6 flex justify-between w-[90%] mx-auto rounded-md">
      <div className="text-xl font-[600]">Wisdom</div>
      <button
        className="text-sm hover:bg-neutral-50 py-1 px-3 rounded transition-all duration-100"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
