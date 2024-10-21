import { redirect, useParams } from "react-router-dom";
import { useAuthContext } from "../../utils/hooks";
import {
  checkForRootFolder,
  getAllNotesAndFoldersFromParentID,
  getFolderById,
} from "../../utils/db";
import { useEffect, useState } from "react";
import { NotesAndFolder, PromiseResponse, Resp_Folder } from "../../types";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import RootFolder from "../../components/dashboard/RootFolder";
import { toast } from "sonner";
import { commonErrorHandling } from "../../utils/helpers";

export default function Dashboard() {
  const { user, loading: userLoading } = useAuthContext();
  const [filesAndFolder, setNotesAndFolder] = useState<NotesAndFolder>({
    files: [],
    folders: [],
  });
  const [rootFolder, setRootFolder] = useState<Resp_Folder | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  async function fetchRootFolder() {
    try {
      setLoading(true);
      let resp: PromiseResponse<Resp_Folder> | null = null;
      if (!id) {
        resp = await checkForRootFolder(user!.id);
      } else {
        resp = await getFolderById(id, user!.id);
      }
      if (resp.error) {
        toast.error(resp.message)
        return;
      };
      setRootFolder(resp.data);
      const parent_id = resp.data.$id;

      const filesAndFolders = await getAllNotesAndFoldersFromParentID(
        parent_id,
        user!.id
      );

      if (filesAndFolders.error) {
        toast.error(filesAndFolders.message)
        return;
      };
      setNotesAndFolder(filesAndFolders.data);
      setLoading(false);
    } catch (err) {
      const error = commonErrorHandling(err);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (!userLoading && user) {
      fetchRootFolder();
    }
  }, [user, id, userLoading]);

  if (userLoading) {
    return <></>;
  }
  if (!user) {
    redirect("/signup");
  }

  return (
    <div className="h-[100vh] p-4 bg-gradient-to-bl from-blue-50 to-white">
      <Header />
      <div className="min-h-[90vh] flex items-center justify-center gap-8 w-[90%] mx-auto">
        <Sidebar collection={filesAndFolder} />
        <RootFolder
          collection={filesAndFolder}
          rootFolder={rootFolder}
          loading={loading}
          resetRootAndCollection={fetchRootFolder}
        />
      </div>
    </div>
  );
}
