import { redirect, useParams } from "react-router-dom"
import { useAuthContext } from "../../utils/hooks"
import { checkForRootFolder, getAllFilesAndFoldersFromParentID, getFolderById } from "../../utils/db"
import { useEffect, useState } from "react"
import { FilesAndFolder, PromiseResponse, Resp_Folder } from "../../types"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import RootFolder from "../../components/dashboard/RootFolder"


export default function Dashboard() {

  const {user, loading} = useAuthContext()
  const [filesAndFolder, setFilesAndFolder] = useState<FilesAndFolder>({
    files: [],
    folders: []
  })
  const [rootFolder, setRootFolder] = useState<Resp_Folder | null>(null)

  const {id} = useParams<{id: string}>()
  useEffect(() => {
    if(!loading && user) {
      async function fetchRootFolder() {
        try {
          if(!loading && user) {
            let resp: PromiseResponse<Resp_Folder> | null = null
            if(!id) {
              resp = await checkForRootFolder(user.id);
            } else {
              resp = await getFolderById(id, user.id);
            }
            if(resp.error) throw new Error(resp.message);
            setRootFolder(resp.data)
            const parent_id = resp.data.$id;
    
            const filesAndFolders = await getAllFilesAndFoldersFromParentID(parent_id, user.id)
            
            if(filesAndFolders.error) throw new Error(filesAndFolders.message)
            setFilesAndFolder(filesAndFolders.data)
          }
        } catch(err) {
          console.log(err)
        }
      }

      fetchRootFolder()
    }
  },[user, loading, id])


  
  if(loading) {
    return <></>
  }
  if(!user) {
    redirect('/signup')
  }

  return (
    <div className="h-[100vh] p-4 bg-gradient-to-bl from-blue-50 to-white">
      <Header />
      <div className="min-h-[90vh] flex items-center justify-center gap-8 w-[90%] mx-auto">
        <Sidebar collection={filesAndFolder}/>
        {rootFolder && <RootFolder collection={filesAndFolder} rootFolder={rootFolder} />}
      </div>
    </div>
  )
}
