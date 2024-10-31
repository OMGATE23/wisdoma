import { Link } from "react-router-dom";
import FolderIcon from "../icons/FolderIcon";
import DocumentIcon from "../icons/DocumentIcon";
import { NotesAndFolder } from "../types";
import { useEffect, useRef, useState } from "react";
import { commonErrorHandling } from "../utils/helpers";
import { toast } from "sonner";
import { getAllNotesAndFolders } from "../utils/db";
import { useAuthContext } from "../utils/hooks";

export default function Sidebar(props: { reload: boolean }) {
  const { user } = useAuthContext();
  const [collection, setCollection] = useState<NotesAndFolder>({
    folders: [],
    files: [],
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const panelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    async function loadCollection() {
      try {
        const resp = await getAllNotesAndFolders(user!.id);
        if (resp.error) {
          toast.error(resp.message);
          return;
        }
        setCollection(resp.data);
      } catch (err) {
        const error = commonErrorHandling(err);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, [user, props.reload]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-50 p-2 rounded shadow outline outline-1 outline-neutral-400 md:hidden" 
      >
        <DocumentIcon />
      </button>

      {sidebarOpen && (
        <div ref={panelRef} className="fixed top-32 left-4 w-60 max-h-[80vh] bg-white border border-neutral-200 rounded shadow-md overflow-y-scroll p-4 z-40 md:hidden">
          <div className="pb-4 border-b border-neutral-200">
            <p className="text-sm font-semibold text-neutral-700 mb-2">
              FOLDERS
            </p>
            {!loading && collection.folders.length === 0 && (
              <p className="italic text-sm text-neutral-500">
                No folders created
              </p>
            )}
            {!loading &&
              collection.folders.map((fol) => (
                <Link
                  key={fol.$id}
                  to={fol.is_root ? `/folder` : `/folder/${fol.$id}`}
                  className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-semibold transition-all duration-100"
                  onClick={() => setSidebarOpen(false)} 
                >
                  <div className="w-4">
                    <FolderIcon size={16} />
                  </div>
                  <p className="text-sm text-neutral-800">
                    {fol.is_root ? "Your Workspace" : fol.title}
                  </p>
                </Link>
              ))}
          </div>

          <div className="pb-4 border-b border-neutral-200 mt-4">
            <p className="text-sm font-semibold text-neutral-700 mb-2">NOTES</p>
            {!loading && collection.files.length === 0 && (
              <p className="italic text-sm text-neutral-500">No notes found</p>
            )}
            {!loading &&
              collection.files.map((file) => (
                <Link
                  key={file.$id}
                  to={`/note/${file.$id}`}
                  className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-semibold transition-all duration-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="w-4">
                    <DocumentIcon size={16} />
                  </div>
                  <p className="text-sm text-ellipsis text-neutral-800">
                    {file.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      )}

      <div className="hidden md:flex md:flex-col md:w-[17.5vw] h-[100vh] overflow-y-scroll border-r border-neutral-200 p-4 sticky top-0">
        <div className="pb-4 border-b border-neutral-200">
          <p className="text-sm font-semibold text-neutral-700 mb-2">FOLDERS</p>
          {!loading && collection.folders.length === 0 && (
            <p className="italic text-sm text-neutral-500">
              No folders created
            </p>
          )}
          {!loading &&
            collection.folders.map((fol) => (
              <Link
                key={fol.$id}
                to={fol.is_root ? `/folder` : `/folder/${fol.$id}`}
                className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-semibold transition-all duration-100"
              >
                <div className="w-4">
                  <FolderIcon size={16} />
                </div>
                <p className="text-sm text-neutral-800 truncate max-w-56 md:max-w-[15vw]">
                  {fol.is_root ? "Your Workspace" : fol.title}
                </p>
              </Link>
            ))}
        </div>

        <div className="pb-4 border-b border-neutral-200 mt-4">
          <p className="text-sm font-semibold text-neutral-700 mb-2">NOTES</p>
          {!loading && collection.files.length === 0 && (
            <p className="italic text-sm text-neutral-500">No notes found</p>
          )}
          {!loading &&
            collection.files.map((file) => (
              <Link
                key={file.$id}
                to={`/note/${file.$id}`}
                className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-semibold transition-all duration-100"
              >
                <div className="w-4">
                  <DocumentIcon size={16} />
                </div>
                <p className="text-sm text-ellipsis text-neutral-800">
                  {file.title}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
