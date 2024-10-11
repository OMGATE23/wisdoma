import { useState } from "react"
import { Resp_File } from "../../types"
import { debounce } from "../../utils/helpers";
import { saveNoteContent } from "../../utils/db";

interface Props {
  note: Resp_File,
  editable: boolean
}
export default function NoteEditor(props: Props) {
  const [content, setContent] = useState(props.note.note_content);

  const debouncedSave = debounce((noteId: string, content: string) => {
    saveNoteContent(noteId, content);
  }, 500);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>){
    setContent(e.target.value);
    debouncedSave(props.note.$id, e.target.value);
  }
  return (
    <div>
      {
        props.editable ? (
          <textarea 
            onChange={handleChange}
            value={content}
            className="outline outline-1 outline-neutral-200 w-[500px] h-[400px] p-4 rounded"
          >
          </textarea>
        ) : (
          <div>
            {content}
          </div>
        )
      }
    </div>
  )
}
