import { useAuthContext } from "../utils/hooks"

export default function Header() {
  const {logout} = useAuthContext()
  return (
    <div className="text-neutral-900 py-2.5 px-6 flex justify-between border-b border-solid border-neutral-200">
      <div className="text-xl font-[600]">
        Wisdom
      </div>
      <button 
        className="text-sm hover:bg-neutral-50 py-1 px-3 rounded transition-all duration-100" 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}
