import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
      console.log(">>>title", title);
      await updateNoteTitle(note.$id, title);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Notes: {id}
      {note && !loading && (
        <div className="flex flex-col gap-4 items-center">
          <Link to={`/folder/${note.parent_id}`}>Parent Folder</Link>
          <textarea
            defaultValue={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            onBlur={() => {
              updateTitle();
            }}
            className="text-5xl font-bold w-[60%] resize-none h-fit p-4 outline-none"
          />
          <NoteEditor
            note={note}
            editable={note.user_id === user?.id}
            collection={collection}
          />
        </div>
      )}
    </div>
  );
}
