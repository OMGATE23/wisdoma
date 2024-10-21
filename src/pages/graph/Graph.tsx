import { useEffect, useState } from "react";
import {
  NotesAndFolder,
  PromiseResponse,
  Resp_Connection,
  Resp_Folder,
} from "../../types";
import { useAuthContext } from "../../utils/hooks";
import {
  checkForRootFolder,
  getAllNotesAndFolders,
  getConnections,
} from "../../utils/db";
import GraphView from "../../components/graph/GraphView";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { commonErrorHandling } from "../../utils/helpers";

export default function Graph() {
  const [collection, setCollection] = useState<NotesAndFolder>({
    files: [],
    folders: [],
  });
  const [connections, setConnections] = useState<Resp_Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userLoading && user) {
      async function fetchRootFolder() {
        try {
          setLoading(true);
          let resp: PromiseResponse<Resp_Folder> | null = null;
          resp = await checkForRootFolder(user!.id);

          if (resp.error) {
            toast.error(resp.message)
            return;
          };

          const filesAndFolders = await getAllNotesAndFolders(user!.id);
          if (filesAndFolders.error) {
            toast.error(filesAndFolders.message)
            return;
          };
          setCollection({
            files: filesAndFolders.data.files,
            folders: filesAndFolders.data.folders,
          });

          const connections = await getConnections(user!.id);
          if (connections.error) {
            toast.error(connections.message)
            return;
          };

          setConnections(connections.data);
          setLoading(false);
        } catch (err) {
          const error = commonErrorHandling(err);
          toast.error(error.message);
          setLoading(false);
        }
      }

      fetchRootFolder();
    }
  }, [user, userLoading]);

  if (loading) {
    return <p>Loading...</p>;
  }

  // Prepare nodes and links based on folders, files, and connections
  const nodes = [
    ...collection.folders.map((folder) => ({
      id: folder.$id,
      title: folder.title,
      group: 1, // Folder group
      type: folder.type,
      is_root: folder.is_root,
    })),
    ...collection.files.map((file) => ({
      id: file.$id,
      title: file.title,
      group: 2, // File group
      type: file.type,
    })),
  ];

  const links = [
    // Link between files/folders and their parent folders
    ...collection.files.map((file) => ({
      source: file.parent_id,
      target: file.$id,
    })),
    ...collection.folders
      .filter((folder) => folder.parent_id)
      .map((folder) => ({ source: folder.parent_id!, target: folder.$id })),

    // Link between items in destination_ids and source_id
    ...connections.flatMap((connection) =>
      connection.destination_ids
        .filter(
          (destination_id) =>
            collection.files.find(
              (note) => note.$id === JSON.parse(destination_id).id
            ) !== undefined
        )
        .map((destination_id) => ({
          source: connection.source_id,
          target: JSON.parse(destination_id).id,
        }))
    ),
  ];

  const handleClickNode = (node: {
    type: string;
    id: string;
    is_root?: boolean;
  }) => {
    if (node.type === "file") {
      navigate(`/note/${node.id}`);
    } else if (node.type === "folder") {
      if (node.is_root) {
        navigate("/folder");
      } else {
        navigate(`/folder/${node.id}`);
      }
    }
  };

  return (
    <div>
      {!loading && (
        <GraphView nodes={nodes} links={links} onClickNode={handleClickNode} />
      )}
    </div>
  );
}
