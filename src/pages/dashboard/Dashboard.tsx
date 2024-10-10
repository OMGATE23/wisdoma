import { Link, redirect } from "react-router-dom"
import { useAuthContext } from "../../utils/hooks"
import { checkForRootFolder, createRootFolder, getAllFilesAndFoldersFromParentID } from "../../utils/db"
import { defaultRootFolder } from "../../utils/constants"
import { useEffect, useState } from "react"
import { FilesAndFolder, Resp_Folder } from "../../types"


export default function Dashboard() {

  const {user, logout, loading} = useAuthContext()
  const [rootFolder, setRootFolder] = useState<Resp_Folder | null>(null)
  const [filesAndFolder, setFilesAndFolder] = useState<FilesAndFolder>({
    files: [],
    folders: []
  })

  useEffect(() => {
    if(!loading && user) {
      fetchRootFolder()
    }
  },[user, loading])


  async function fetchRootFolder() {
    try {
      if(!loading && user) {
        const resp = await checkForRootFolder(user.id);
        if(resp.error) throw new Error(resp.message);
        setRootFolder(resp.data);

        const parent_id = resp.data.$id;

        const filesAndFolders = await getAllFilesAndFoldersFromParentID(parent_id, user.id)
        
        if(filesAndFolders.error) throw new Error(filesAndFolders.message)
        setFilesAndFolder(filesAndFolders.data)
      }
    } catch(err) {
      console.log(err)
    }
  }
  if(loading) {
    return <></>
  }
  if(!user) {
    redirect('/signup')
  }

  return (
    <div>
      Hello {user!.name}

      <Link to='/notes/3452'>Note 3452</Link>

      <button onClick={logout}>Logout</button>

      <div className="h-[60vh] flex justify-center items-center">
        <button
          className="outline outline-1 outline-zinc-200 rounded-md p-2"
          onClick={() => {
            createRootFolder({...defaultRootFolder, user_id: user!.id})
          }}
        >
          Create a document
        </button>
      </div>
    </div>
  )
}
