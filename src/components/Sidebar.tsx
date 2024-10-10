import { FilesAndFolder } from "../types"

interface Props {
  collection: FilesAndFolder
}
export default function Sidebar(props: Props) {

  if (props.collection.files.length === 0 && props.collection.folders.length === 0) {
    return (
      <div className="w-[50%] md:w-[20%] h-[100vh] border-r border-solid border-neutral-200 p-4">
        <p className="italic text-neutral-400 font-[300] text-sm">No notes or folders created</p>
      </div>
    )
  }
  return (
    <div>
      
    </div>
  )
}
