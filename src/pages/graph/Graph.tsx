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
import GraphView from "../../components/visualize/GraphView";
import { toast } from "sonner";
import { commonErrorHandling } from "../../utils/helpers";
import SimpleTidyTree from "../../components/visualize/SimpleTidyTree";
import RadialTidyTree from "../../components/visualize/RadialTidyTree";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function Graph() {
  const [collection, setCollection] = useState<NotesAndFolder>({
    files: [],
    folders: [],
  });
  const [connections, setConnections] = useState<Resp_Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useAuthContext();
  const [currentView, setCurrentView] = useState<
    "graph" | "simple-tidy" | "radial-tidy"
  >("graph");

  useEffect(() => {
    if (!userLoading && user) {
      async function fetchRootFolder() {
        try {
          setLoading(true);
          let resp: PromiseResponse<Resp_Folder> | null = null;
          resp = await checkForRootFolder(user!.id);

          if (resp.error) {
            toast.error(resp.message);
            return;
          }

          const filesAndFolders = await getAllNotesAndFolders(user!.id);
          if (filesAndFolders.error) {
            toast.error(filesAndFolders.message);
            return;
          }
          setCollection({
            files: filesAndFolders.data.files,
            folders: filesAndFolders.data.folders,
          });

          const connections = await getConnections(user!.id);
          if (connections.error) {
            toast.error(connections.message);
            return;
          }

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
    return (
      <div className="font-lora flex justify-center items-center h-[100vh]">
        Good things come to those who wait...
      </div>
    );
  }

  return (
    <div>
      <Header />
      {!loading && (
        <div className="flex ">
          <Sidebar reload={loading} />
          <div className="w-[80%]">
            <div className="flex items-center justify-center gap-0 mt-4">
              <button
                className={`border border-neutral-200 px-4 py-1 rounded-l ${
                  currentView === "graph" && "bg-neutral-200"
                }`}
                onClick={() => setCurrentView("graph")}
              >
                Graph
              </button>
              <button
                className={`border border-neutral-200 px-4 py-1 ${
                  currentView === "simple-tidy" && "bg-neutral-200"
                }`}
                onClick={() => setCurrentView("simple-tidy")}
              >
                Simple Tree
              </button>
              <button
                className={`border border-neutral-200 px-4 py-1 rounded-r ${
                  currentView === "radial-tidy" && "bg-neutral-200"
                }`}
                onClick={() => setCurrentView("radial-tidy")}
              >
                Radial Tree
              </button>
            </div>
            <>
              {currentView === "graph" && (
                <GraphView collection={collection} connections={connections} />
              )}
              {currentView === "simple-tidy" && (
                <SimpleTidyTree collection={collection} />
              )}
              {currentView === "radial-tidy" && (
                <RadialTidyTree collection={collection} />
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
}
