import { Link } from "react-router-dom";
import FolderIcon from "../icons/FolderIcon";
import { NotesAndFolder } from "../types";
import DocumentIcon from "../icons/DocumentIcon";
import { useEffect, useState } from "react";
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
  return (
    <div className="w-[50%] bg-white md:w-[20%] h-[100vh] overflow-y-scroll border-r border-neutral-200 p-4 sticky top-0">
      <div className="pb-4 border-b border-neutral-200">
        <p className="text-sm font-[600] text-neutral-700 mb-2">FOLDERS</p>

        {!loading && collection.folders.length === 0 && (
          <p className="italic text-sm text-neutral-500">No folders created</p>
        )}
        {!loading &&
          collection.folders.map((fol) => (
            <Link
              to={fol.is_root ? `/folder` : `/folder/${fol.$id}`}
              className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-[600] transition-all duration-100"
            >
              <div className="w-4">
                <FolderIcon size={16} />
              </div>
              <p className="text-sm text-neutral-800 hover:text-black">
                {fol.is_root ? "Your Workspace" : fol.title}
              </p>
            </Link>
          ))}
      </div>
      <div className="pb-4 border-b border-neutral-200 mt-4">
        <p className="text-sm font-[600] text-neutral-700 mb-2">NOTES</p>
        {!loading && collection.folders.length === 0 && (
          <p className="italic text-sm text-neutral-500">No folders created</p>
        )}
        {!loading &&
          collection.files.map((fol) => (
            <Link
              to={`/note/${fol.$id}`}
              className="flex gap-2 mb-1 text-neutral-800 hover:text-black hover:font-[600] transition-all duration-100"
            >
              <div className="w-4">
                <DocumentIcon size={16} />
              </div>
              <p className="text-sm text-ellipsis text-neutral-800 hover:text-black">
                {fol.title}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}
