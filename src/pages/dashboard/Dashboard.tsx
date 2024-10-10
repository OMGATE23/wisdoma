import { redirect } from "react-router-dom"
import { useAuthContext } from "../../utils/hooks"
import { checkForRootFolder, getAllFilesAndFoldersFromParentID } from "../../utils/db"
import { useEffect, useState } from "react"
import { FilesAndFolder } from "../../types"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import RootFolder from "../../components/dashboard/RootFolder"


export default function Dashboard() {

  const {user, loading} = useAuthContext()
  const [filesAndFolder, setFilesAndFolder] = useState<FilesAndFolder>({
    files: [],
    folders: []
  })

  useEffect(() => {
    if(!loading && user) {
      async function fetchRootFolder() {
        try {
          if(!loading && user) {
            const resp = await checkForRootFolder(user.id);
            if(resp.error) throw new Error(resp.message);

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
  },[user, loading])


  
  if(loading) {
    return <></>
  }
  if(!user) {
    redirect('/signup')
  }

  return (
    <div>
      <Header />
      <div className="min-h-[100vh] flex items-stretch">
        <Sidebar collection={filesAndFolder}/>
        <RootFolder collection={filesAndFolder} />
      </div>
    </div>
  )
}
