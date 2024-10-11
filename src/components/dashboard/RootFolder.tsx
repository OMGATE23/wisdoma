
import { FilesAndFolder, Resp_Folder } from '../../types'
import Button from '../Button'
import DocumentIcon from '../../icons/DocumentIcon'
import FolderIcon from '../../icons/FolderIcon'
import { createFile, createFolder } from '../../utils/db'
import { getCurrentDateISOString } from '../../utils/helpers'
import { useAuthContext } from '../../utils/hooks'
import { Link, useNavigate } from 'react-router-dom'

interface Props {
  collection: FilesAndFolder,
  rootFolder: Resp_Folder
}
export default function RootFolder(props: Props) {
  const {user} = useAuthContext()
  const navigate = useNavigate()

  async function createFileInRoot() {
    try {
      const resp = await createFile({
        title: 'first note',
        note_content: '',
        parent_id: props.rootFolder.$id,
        created_at: getCurrentDateISOString(),
        updated_at: getCurrentDateISOString(),
        user_id: user!.id,
        is_public: false,
        is_starred: false
      })

      if(resp.error) throw new Error(resp.message);

      const fileId = resp.data.$id;

      console.log('redirecting', fileId)
      navigate(`/note/${fileId}`)
    } catch(error) {
      console.log(error)
    }
  }

  async function createFolderInRoot() {
    try {
      const resp = await createFolder(
        user!.id,
        props.rootFolder.$id,
        'folder in root'
      )

      if(resp.error) throw new Error(resp.message);

      const folderId = resp.data.$id;

      console.log('redirecting', folderId)
      navigate(`/folder/${folderId}`)
    } catch(error) {
      console.log(error)
    }
  }

    return (
      <div className="flex bg-white flex-col gap-4 items-center justify-center w-[80%] h-[80vh] outline outline-1 outline-neutral-200 rounded-md p-4 overflow-auto">
        {
          props.rootFolder.parent_id && <Link to={`/folder/${props.rootFolder.parent_id}`}>Go Back</Link>
        }
        {
          props.collection.files.length === 0 && props.collection.folders.length === 0 ? 
          (
            <>
              <p className='text-3xl font-[600] text-neutral-800'>Create notes and folders now!</p>
              <div
                className='flex items-center justify-between gap-4'
              >
                <Button
                  intent='filled'
                  text='Create Note'
                  icon={<DocumentIcon/>}
                  bgColor='bg-green-500'
                  textColor='text-white'
                  onClick={() => {createFileInRoot()}}
                />
                <Button
                  intent='outline'
                  text='Create Folder'
                  icon={<FolderIcon/>}
                  bgColor='bg-blue-500'
                  textColor='text-white'
                  onClick={() => {createFolderInRoot()}}
                />
              </div>
            </>
          ) : (
            <>
              <div
                className='flex items-center justify-between gap-4'
              >
                <Button
                  intent='filled'
                  text='Create Note'
                  icon={<DocumentIcon/>}
                  bgColor='bg-green-500'
                  textColor='text-white'
                  onClick={() => {createFileInRoot()}}
                />
                <Button
                  intent='outline'
                  text='Create Folder'
                  icon={<FolderIcon/>}
                  bgColor='bg-blue-500'
                  textColor='text-white'
                  onClick={() => {createFolderInRoot()}}
                />
              </div>
              <div className='w-full grid grid-cols-6 gap-4'>
                {
                  props.collection.files.map(file => (
                    <Link key={file.$id} to={`/note/${file.$id}`} className='flex flex-col p-4 rounded'>
                      <DocumentIcon size={32}/>
                      {file.title}
                    </Link>
                  ))
                }

                {
                  props.collection.folders.map(folder => (
                    <Link key={folder.$id} to={`/folder/${folder.$id}`} className='flex flex-col p-4 rounded'>
                      <FolderIcon size={32}/>
                      {folder.title}
                    </Link>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    )

}
