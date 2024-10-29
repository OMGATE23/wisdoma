import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NotesAndFolder, Resp_Note } from "../../types";
import {
  getAllNotesAndFolders,
  getNoteById,
  updateNoteTitle,
} from "../../utils/db";
import { useAuthContext } from "../../utils/hooks";
import { commonErrorHandling } from "../../utils/helpers";
import NoteEditor from "../../components/note/NoteEditor";
import { toast } from "sonner";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import BreadCrumb from "../../components/BreadCrumb";

export default function Notes() {
  const [note, setNote] = useState<Resp_Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<NotesAndFolder>({
    files: [],
    folders: [],
  });
  const [title, setTitle] = useState("");
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function getNote() {
      try {
        if (id) {
          setLoading(true);
          const resp = await getNoteById(id, user?.id || "");
          const collectionResp = await getAllNotesAndFolders(user?.id || "");
          if (resp.error) {
            toast.error(resp.message);
            return;
          }
          setNote(resp.data);
          setTitle(resp.data.title);
          if (collectionResp.error) {
            toast.error(collectionResp.message);
            return;
          }

          setCollection(collectionResp.data);
          setLoading(false);
        }
      } catch (error: unknown) {
        const err = commonErrorHandling(error);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    getNote();
  }, [user, id]);

  if (!id) {
    navigate("/folder");
  }

  if (loading) {
    return <></>;
  }

  const updateTitle = async () => {
    try {
      if (!note) return;
      setLoading(true);
      await updateNoteTitle(note.$id, title);
    } catch (err) {
      const error = commonErrorHandling(err);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-[100vh]">
      <Header />
      <div className="flex items-stretch min-h-[100vh]">
        <Sidebar reload={loading} />
        {note && !loading && (
          <div className="p-4 w-full">
            <BreadCrumb currentNode={note} />
            <div className=" flex flex-col items-center mx-auto mt-4 w-[80%]">
              <textarea
                placeholder="Untitled"
                defaultValue={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onBlur={() => {
                  updateTitle();
                }}
                style={{ height: "auto" }}
                className="text-5xl font-bold resize-none p-4 w-full ml-16 outline-none"
              />
              <NoteEditor
                note={note}
                editable={note.user_id === user?.id}
                collection={collection}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
