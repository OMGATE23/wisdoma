import { useEffect, useState } from 'react';
import { Resp_Folder, Resp_Note } from '../types';
import { commonErrorHandling } from '../utils/helpers';
import { toast } from 'sonner';
import { getAllFolders } from '../utils/db';
import { useAuthContext } from '../utils/hooks';
import { Link } from 'react-router-dom';

interface Props {
  currentNode: Resp_Folder | Resp_Note;
}
export default function BreadCrumb(props: Props) {
  const [breadCrumbPath, setBreadCrumbPath] = useState<Resp_Folder[]>([]);
  const { user } = useAuthContext();

  useEffect(() => {
    function getBreadcrumbPath(folders: Resp_Folder[]) {
      const path: Resp_Folder[] = [];

      if (!props.currentNode || props.currentNode.parent_id === null) {
        return setBreadCrumbPath(path);
      }

      let currentNode = props.currentNode;

      while (currentNode.parent_id !== null) {
        const parentFolder = folders.find(
          fol => fol.$id === currentNode.parent_id,
        );

        if (!parentFolder) break;

        path.unshift(parentFolder);
        currentNode = parentFolder;
      }

      setBreadCrumbPath(path);
    }
    async function loadFolders() {
      try {
        const resp = await getAllFolders(user!.id);
        if (resp.error) {
          toast.error(resp.message);
          return;
        }

        getBreadcrumbPath(resp.data);
      } catch (err) {
        const error = commonErrorHandling(err);
        toast.error(error.message);
      }
    }

    loadFolders();
  }, [user, props.currentNode]);
  return (
    <div className="breadcrumb flex space-x-2 whitespace-nowrap text-neutral-700 mx-auto md:mx-0 w-[80%] overflow-x-auto  md:justify-normal">
      {breadCrumbPath.map((folder, index) => (
        <div key={folder.$id} className="inline-block w-full md:w-auto">
          <Link className="hover:text-black" to={`/folder/${folder.$id}`}>
            {folder.is_root ? 'Your Workspace' : folder.title}
          </Link>
          {index < breadCrumbPath.length - 1 && <span className="mx-1">/</span>}
        </div>
      ))}
    </div>
  );
}
