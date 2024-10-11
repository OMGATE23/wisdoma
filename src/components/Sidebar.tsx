import { useEffect, useState } from "react"
import { FilesAndFolder, Resp_File } from "../types"

interface Props {
  collection: FilesAndFolder
}
export default function Sidebar(props: Props) {
  const [starredNotes, setStarredNotes] = useState<Resp_File[]>([]);

  useEffect(() => {
    const starredNotes = props.collection.files.filter(note => note.is_starred);
    setStarredNotes(starredNotes);
  } , [props.collection.files])
  return (
    <div className="w-[50%] bg-white md:w-[20%] h-[80vh] outline outline-1 outline-neutral-200 rounded-md p-4">
      <p className="italic text-neutral-400 font-[300] text-sm">No notes or folders created</p>

      {
        starredNotes.map(note => (
          <div>{note.title}</div>
        ))
      }
    </div>
  )
}
